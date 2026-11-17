import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Edit3,
  ExternalLink,
  FolderTree,
  Layers,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  Search,
  Tag,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { fetchStorefrontCatalog } from '@/src/services/catalog';
import {
  createBrand,
  createCategory,
  deleteBrand,
  deleteCategory,
  deleteProductById,
  saveProductWithTiers,
  updateBrand,
  updateCategory,
  uploadProductImage,
} from '@/src/services/adminCatalog';
import type { Brand, Category, ProductWithDetails } from '@/src/types/database';
import { useLanguage } from '@/src/context/LanguageContext';
import { AdminNavbar } from '@/src/components/layout/AdminNavbar';
import { MedicalImage } from '@/src/components/ui/MedicalImage';
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog';
import { formatBundleLabel, formatKWD } from '@/src/utils/currency';
import { cn } from '@/src/utils/cn';

type AdminTab = 'products' | 'brands' | 'categories';

interface TierDraft {
  key: string;
  units_per_bundle: string;
  bundle_price: string;
}

interface DeleteTarget {
  type: 'product' | 'brand' | 'category';
  id: string;
  name: string;
}

function makeTierKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AdminDashboardPage() {
  const { language, dir, t } = useLanguage();

  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrandId, setFilterBrandId] = useState('all');
  const [filterCategoryId, setFilterCategoryId] = useState('all');

  // Product Form Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBrandId, setFormBrandId] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formTiers, setFormTiers] = useState<TierDraft[]>([
    { key: makeTierKey(), units_per_bundle: '1', bundle_price: '' },
  ]);
  const [formError, setFormError] = useState<string | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Brand CRUD State
  const [newBrandName, setNewBrandName] = useState('');
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [editingBrandName, setEditingBrandName] = useState('');
  const [busyEntity, setBusyEntity] = useState(false);

  // Category CRUD State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  // Confirm Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStorefrontCatalog();
      setProducts(data.products);
      setBrands(data.brands);
      setCategories(data.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.loadCatalogFallback);
    } finally {
      setLoading(false);
    }
  }, [t.errors.loadCatalogFallback]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const totalTiersCount = useMemo(
    () => products.reduce((sum, p) => sum + p.pricing_tiers.length, 0),
    [products]
  );

  const brandProductCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      map.set(p.brand_id, (map.get(p.brand_id) ?? 0) + 1);
    }
    return map;
  }, [products]);

  const categoryProductCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      map.set(p.category_id, (map.get(p.category_id) ?? 0) + 1);
    }
    return map;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchBrand = filterBrandId === 'all' || p.brand_id === filterBrandId;
      const matchCat = filterCategoryId === 'all' || p.category_id === filterCategoryId;
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false) ||
        (p.brand?.name.toLowerCase().includes(q) ?? false) ||
        (p.category?.name.toLowerCase().includes(q) ?? false);
      return matchBrand && matchCat && matchQ;
    });
  }, [products, searchQuery, filterBrandId, filterCategoryId]);

  // Open Product Form for Create
  const openCreateProduct = () => {
    setEditingProductId(null);
    setFormName('');
    setFormDescription('');
    setFormBrandId(brands[0]?.id ?? '');
    setFormCategoryId(categories[0]?.id ?? '');
    setFormImageUrl('');
    setFormTiers([{ key: makeTierKey(), units_per_bundle: '1', bundle_price: '' }]);
    setFormError(null);
    setProductModalOpen(true);
  };

  // Open Product Form for Edit
  const openEditProduct = (product: ProductWithDetails) => {
    setEditingProductId(product.id);
    setFormName(product.name);
    setFormDescription(product.description ?? '');
    setFormBrandId(product.brand_id);
    setFormCategoryId(product.category_id);
    setFormImageUrl(product.image_url ?? '');
    setFormTiers(
      product.pricing_tiers.length > 0
        ? product.pricing_tiers.map((tier) => ({
            key: tier.id,
            units_per_bundle: String(tier.units_per_bundle),
            bundle_price: Number(tier.bundle_price).toFixed(3),
          }))
        : [{ key: makeTierKey(), units_per_bundle: '1', bundle_price: '' }]
    );
    setFormError(null);
    setProductModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const publicUrl = await uploadProductImage(file);
      setFormImageUrl(publicUrl);
      toast.success(t.admin.toastImageUploaded);
    } catch (err) {
      toast.error(t.admin.toastImageUploadFailed, {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const addTierRow = () => {
    setFormTiers((prev) => [
      ...prev,
      { key: makeTierKey(), units_per_bundle: '', bundle_price: '' },
    ]);
  };

  const removeTierRow = (key: string) => {
    setFormTiers((prev) => (prev.length > 1 ? prev.filter((item) => item.key !== key) : prev));
  };

  const updateTierRow = (key: string, field: 'units_per_bundle' | 'bundle_price', value: string) => {
    setFormTiers((prev) =>
      prev.map((item) => (item.key === key ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError(t.admin.valNameRequired);
      return;
    }
    if (!formBrandId) {
      setFormError(t.admin.valBrandRequired);
      return;
    }
    if (!formCategoryId) {
      setFormError(t.admin.valCategoryRequired);
      return;
    }
    if (formTiers.length === 0) {
      setFormError(t.admin.valAtLeastOneTier);
      return;
    }

    const parsedTiers: { units_per_bundle: number; bundle_price: number }[] = [];
    for (const tier of formTiers) {
      const units = Number(tier.units_per_bundle);
      const price = Number(tier.bundle_price);

      if (!Number.isInteger(units) || units <= 0) {
        setFormError(t.admin.valInvalidUnits);
        return;
      }
      if (!Number.isFinite(price) || price <= 0) {
        setFormError(t.admin.valInvalidPrice);
        return;
      }
      parsedTiers.push({ units_per_bundle: units, bundle_price: price });
    }

    setSavingProduct(true);
    try {
      await saveProductWithTiers({
        id: editingProductId,
        name: formName,
        description: formDescription,
        image_url: formImageUrl,
        brand_id: formBrandId,
        category_id: formCategoryId,
        tiers: parsedTiers,
      });
      toast.success(t.admin.toastProductSaved);
      setProductModalOpen(false);
      await loadAll();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t.errors.loadCatalogFallback);
    } finally {
      setSavingProduct(false);
    }
  };

  // Brand Handlers
  const handleAddBrand = async (e: FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) {
      toast.error(t.admin.valBrandNameRequired);
      return;
    }
    setBusyEntity(true);
    try {
      await createBrand(newBrandName);
      setNewBrandName('');
      toast.success(t.admin.toastBrandAdded);
      await loadAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.errors.loadCatalogFallback);
    } finally {
      setBusyEntity(false);
    }
  };

  const handleSaveBrandEdit = async (id: string) => {
    if (!editingBrandName.trim()) {
      toast.error(t.admin.valBrandNameRequired);
      return;
    }
    setBusyEntity(true);
    try {
      await updateBrand(id, editingBrandName);
      setEditingBrandId(null);
      toast.success(t.admin.toastBrandUpdated);
      await loadAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.errors.loadCatalogFallback);
    } finally {
      setBusyEntity(false);
    }
  };

  const requestDeleteBrand = (brand: Brand) => {
    const count = brandProductCounts.get(brand.id) ?? 0;
    if (count > 0) {
      toast.error(t.admin.cannotDeleteBrandInUse);
      return;
    }
    setDeleteTarget({ type: 'brand', id: brand.id, name: brand.name });
  };

  // Category Handlers
  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error(t.admin.valCategoryNameRequired);
      return;
    }
    setBusyEntity(true);
    try {
      await createCategory(newCategoryName);
      setNewCategoryName('');
      toast.success(t.admin.toastCategoryAdded);
      await loadAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.errors.loadCatalogFallback);
    } finally {
      setBusyEntity(false);
    }
  };

  const handleSaveCategoryEdit = async (id: string) => {
    if (!editingCategoryName.trim()) {
      toast.error(t.admin.valCategoryNameRequired);
      return;
    }
    setBusyEntity(true);
    try {
      await updateCategory(id, editingCategoryName);
      setEditingCategoryId(null);
      toast.success(t.admin.toastCategoryUpdated);
      await loadAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.errors.loadCatalogFallback);
    } finally {
      setBusyEntity(false);
    }
  };

  const requestDeleteCategory = (category: Category) => {
    const count = categoryProductCounts.get(category.id) ?? 0;
    if (count > 0) {
      toast.error(t.admin.cannotDeleteCategoryInUse);
      return;
    }
    setDeleteTarget({ type: 'category', id: category.id, name: category.name });
  };

  // Confirm Deletion Execution
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.type === 'product') {
        await deleteProductById(deleteTarget.id);
        toast.success(t.admin.toastProductDeleted);
      } else if (deleteTarget.type === 'brand') {
        await deleteBrand(deleteTarget.id);
        toast.success(t.admin.toastBrandDeleted);
      } else {
        await deleteCategory(deleteTarget.id);
        toast.success(t.admin.toastCategoryDeleted);
      }
      setDeleteTarget(null);
      await loadAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.errors.loadCatalogFallback);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F8] dark:bg-[#0B1518] text-[#25343A] dark:text-[#ECF3F4]">
      <AdminNavbar />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8">
        {/* Dashboard Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#123B45] dark:text-[#ECF3F4]">
              {t.admin.pageTitle}
            </h1>
            <p className="text-sm text-[#25343A]/75 dark:text-[#9AB2B8] mt-1">
              {t.admin.pageSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={loadAll}
            disabled={loading}
            className="h-10 px-4 rounded-lg border border-slate-200 dark:border-[#213B43] bg-white dark:bg-[#112126] hover:border-[#267C78] text-sm font-medium inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} aria-hidden="true" />
            <span>{t.admin.refreshData}</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-5">
            <div className="flex items-center justify-between text-xs text-[#25343A]/70 dark:text-[#9AB2B8]">
              <span>{t.admin.totalProducts}</span>
              <Package className="w-4 h-4 text-[#267C78]" aria-hidden="true" />
            </div>
            <p className="font-mono-num text-2xl font-bold text-[#123B45] dark:text-[#ECF3F4] mt-2">
              {products.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-5">
            <div className="flex items-center justify-between text-xs text-[#25343A]/70 dark:text-[#9AB2B8]">
              <span>{t.admin.totalBrands}</span>
              <Tag className="w-4 h-4 text-[#267C78]" aria-hidden="true" />
            </div>
            <p className="font-mono-num text-2xl font-bold text-[#123B45] dark:text-[#ECF3F4] mt-2">
              {brands.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-5">
            <div className="flex items-center justify-between text-xs text-[#25343A]/70 dark:text-[#9AB2B8]">
              <span>{t.admin.totalCategories}</span>
              <FolderTree className="w-4 h-4 text-[#267C78]" aria-hidden="true" />
            </div>
            <p className="font-mono-num text-2xl font-bold text-[#123B45] dark:text-[#ECF3F4] mt-2">
              {categories.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-5">
            <div className="flex items-center justify-between text-xs text-[#25343A]/70 dark:text-[#9AB2B8]">
              <span>{t.admin.totalTiers}</span>
              <Layers className="w-4 h-4 text-[#267C78]" aria-hidden="true" />
            </div>
            <p className="font-mono-num text-2xl font-bold text-[#123B45] dark:text-[#ECF3F4] mt-2">
              {totalTiersCount}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl border border-slate-200 dark:border-[#213B43] bg-white dark:bg-[#112126] mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap',
              activeTab === 'products'
                ? 'bg-[#123B45] dark:bg-[#267C78] text-white'
                : 'text-[#25343A] dark:text-[#9AB2B8] hover:bg-[#F5F7F8] dark:hover:bg-[#172B31]'
            )}
          >
            {t.admin.tabProducts}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('brands')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap',
              activeTab === 'brands'
                ? 'bg-[#123B45] dark:bg-[#267C78] text-white'
                : 'text-[#25343A] dark:text-[#9AB2B8] hover:bg-[#F5F7F8] dark:hover:bg-[#172B31]'
            )}
          >
            {t.admin.tabBrands}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap',
              activeTab === 'categories'
                ? 'bg-[#123B45] dark:bg-[#267C78] text-white'
                : 'text-[#25343A] dark:text-[#9AB2B8] hover:bg-[#F5F7F8] dark:hover:bg-[#172B31]'
            )}
          >
            {t.admin.tabCategories}
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <section className="space-y-4">
            {/* Toolbar */}
            <div className="rounded-xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative flex-1">
                <Search
                  className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.admin.searchProductsPlaceholder}
                  className="w-full h-10 ps-10 pe-3 rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#0B1518] text-sm focus:outline-none focus:border-[#267C78]"
                />
              </div>

              <select
                value={filterBrandId}
                onChange={(e) => setFilterBrandId(e.target.value)}
                aria-label={t.admin.colBrand}
                className="h-10 px-3 rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#0B1518] text-sm focus:outline-none focus:border-[#267C78]"
              >
                <option value="all">{t.admin.filterAllBrands}</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <select
                value={filterCategoryId}
                onChange={(e) => setFilterCategoryId(e.target.value)}
                aria-label={t.admin.colCategory}
                className="h-10 px-3 rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#0B1518] text-sm focus:outline-none focus:border-[#267C78]"
              >
                <option value="all">{t.admin.filterAllCategories}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={openCreateProduct}
                className="h-10 px-4 rounded-lg bg-[#267C78] hover:bg-[#1F6966] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>{t.admin.createProduct}</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="rounded-xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-start">
                  <thead className="bg-[#F5F7F8] dark:bg-[#172B31] text-xs font-semibold text-[#25343A]/75 dark:text-[#9AB2B8] border-b border-slate-200 dark:border-[#213B43]">
                    <tr>
                      <th className="py-3.5 px-4 text-start">{t.admin.colImage}</th>
                      <th className="py-3.5 px-4 text-start">{t.admin.colName}</th>
                      <th className="py-3.5 px-4 text-start">{t.admin.colBrand}</th>
                      <th className="py-3.5 px-4 text-start">{t.admin.colCategory}</th>
                      <th className="py-3.5 px-4 text-start">{t.admin.colOffers}</th>
                      <th className="py-3.5 px-4 text-end">{t.admin.colActions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#1D353C]">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <Loader2 className="w-6 h-6 animate-spin text-[#267C78] mx-auto" />
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#25343A]/70 dark:text-[#9AB2B8]">
                          {t.admin.noProductsFound}
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-[#F5F7F8]/60 dark:hover:bg-[#172B31]/50">
                          <td className="py-3 px-4">
                            <MedicalImage
                              src={product.image_url}
                              alt={product.name}
                              containerClassName="w-14 h-14 rounded-lg border border-slate-200 dark:border-[#213B43]"
                            />
                          </td>
                          <td className="py-3 px-4 font-medium text-[#123B45] dark:text-[#ECF3F4] max-w-[240px]">
                            <span className="line-clamp-2">{product.name}</span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-[#25343A]/80 dark:text-[#9AB2B8]">
                            {product.brand?.name ?? '-'}
                          </td>
                          <td className="py-3 px-4 text-[#25343A]/80 dark:text-[#9AB2B8] max-w-[180px]">
                            <span className="line-clamp-2">{product.category?.name ?? '-'}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <span className="font-mono-num text-xs font-bold text-[#267C78] dark:text-[#63C2BC] block">
                                {product.pricing_tiers.length === 1
                                  ? t.product.oneOffer
                                  : t.product.offersCount(product.pricing_tiers.length)}
                              </span>
                              <div className="text-xs text-[#25343A]/70 dark:text-[#9AB2B8] space-y-0.5">
                                {product.pricing_tiers.map((tier) => (
                                  <div key={tier.id} className="font-mono-num whitespace-nowrap">
                                    {formatBundleLabel(tier.units_per_bundle, language)}:{' '}
                                    {formatKWD(tier.bundle_price, language)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                to={`/products/${product.id}`}
                                title={t.admin.viewProduct}
                                className="h-9 px-2.5 rounded-lg border border-slate-200 dark:border-[#213B43] hover:border-[#267C78] text-xs font-medium inline-flex items-center gap-1"
                              >
                                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>{t.admin.viewProduct}</span>
                              </Link>
                              <button
                                type="button"
                                onClick={() => openEditProduct(product)}
                                className="h-9 px-2.5 rounded-lg border border-slate-200 dark:border-[#213B43] hover:border-[#267C78] text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>{t.admin.editProduct}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteTarget({
                                    type: 'product',
                                    id: product.id,
                                    name: product.name,
                                  })
                                }
                                className="h-9 px-2.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>{t.admin.deleteProduct}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: BRANDS MANAGEMENT */}
        {activeTab === 'brands' && (
          <section className="space-y-4 max-w-3xl">
            <form
              onSubmit={handleAddBrand}
              className="rounded-xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-4 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder={t.admin.brandInputPlaceholder}
                className="flex-1 h-10 px-3.5 rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#0B1518] text-sm focus:outline-none focus:border-[#267C78]"
              />
              <button
                type="submit"
                disabled={busyEntity}
                className="h-10 px-4 rounded-lg bg-[#267C78] hover:bg-[#1F6966] disabled:opacity-60 text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>{t.admin.addBrandBtn}</span>
              </button>
            </form>

            <div className="rounded-xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] divide-y divide-slate-100 dark:divide-[#1D353C]">
              {brands.map((brand) => {
                const count = brandProductCounts.get(brand.id) ?? 0;
                const isEditing = editingBrandId === brand.id;
                return (
                  <div
                    key={brand.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editingBrandName}
                          onChange={(e) => setEditingBrandName(e.target.value)}
                          className="flex-1 h-9 px-3 rounded-lg border border-[#267C78] bg-[#F5F7F8] dark:bg-[#0B1518] text-sm focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveBrandEdit(brand.id)}
                          disabled={busyEntity}
                          className="h-9 px-3 rounded-lg bg-[#267C78] text-white text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{t.admin.save}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingBrandId(null)}
                          className="h-9 px-3 rounded-lg border border-slate-200 dark:border-[#213B43] text-xs font-medium cursor-pointer"
                        >
                          {t.admin.cancel}
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="font-semibold text-[#123B45] dark:text-[#ECF3F4]">
                            {brand.name}
                          </span>
                          <span className="text-xs text-[#25343A]/65 dark:text-[#9AB2B8] block mt-0.5 font-mono-num">
                            {t.admin.linkedProductsCount(count)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBrandId(brand.id);
                              setEditingBrandName(brand.name);
                            }}
                            className="h-9 px-3 rounded-lg border border-slate-200 dark:border-[#213B43] hover:border-[#267C78] text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{t.admin.editBtn}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDeleteBrand(brand)}
                            className="h-9 px-3 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{t.admin.deleteBtn}</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TAB 3: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <section className="space-y-4 max-w-3xl">
            <form
              onSubmit={handleAddCategory}
              className="rounded-xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-4 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder={t.admin.categoryInputPlaceholder}
                className="flex-1 h-10 px-3.5 rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#0B1518] text-sm focus:outline-none focus:border-[#267C78]"
              />
              <button
                type="submit"
                disabled={busyEntity}
                className="h-10 px-4 rounded-lg bg-[#267C78] hover:bg-[#1F6966] disabled:opacity-60 text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>{t.admin.addCategoryBtn}</span>
              </button>
            </form>

            <div className="rounded-xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] divide-y divide-slate-100 dark:divide-[#1D353C]">
              {categories.map((category) => {
                const count = categoryProductCounts.get(category.id) ?? 0;
                const isEditing = editingCategoryId === category.id;
                return (
                  <div
                    key={category.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          className="flex-1 h-9 px-3 rounded-lg border border-[#267C78] bg-[#F5F7F8] dark:bg-[#0B1518] text-sm focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveCategoryEdit(category.id)}
                          disabled={busyEntity}
                          className="h-9 px-3 rounded-lg bg-[#267C78] text-white text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{t.admin.save}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCategoryId(null)}
                          className="h-9 px-3 rounded-lg border border-slate-200 dark:border-[#213B43] text-xs font-medium cursor-pointer"
                        >
                          {t.admin.cancel}
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="font-semibold text-[#123B45] dark:text-[#ECF3F4]">
                            {category.name}
                          </span>
                          <span className="text-xs text-[#25343A]/65 dark:text-[#9AB2B8] block mt-0.5 font-mono-num">
                            {t.admin.linkedProductsCount(count)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategoryId(category.id);
                              setEditingCategoryName(category.name);
                            }}
                            className="h-9 px-3 rounded-lg border border-slate-200 dark:border-[#213B43] hover:border-[#267C78] text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{t.admin.editBtn}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDeleteCategory(category)}
                            className="h-9 px-3 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{t.admin.deleteBtn}</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Product Create / Edit Modal */}
      {productModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
          dir={dir}
        >
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-[#213B43] bg-white dark:bg-[#112126] shadow-xl my-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-[#1D353C] flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#123B45] dark:text-[#ECF3F4]">
                {editingProductId
                  ? t.admin.productFormEditTitle
                  : t.admin.productFormCreateTitle}
              </h2>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-[#25343A] dark:hover:text-[#ECF3F4] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3.5 text-sm text-red-700 dark:text-red-300">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#123B45] dark:text-[#ECF3F4] mb-1.5">
                  {t.admin.productNameLabel}
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={t.admin.productNamePlaceholder}
                  className="w-full h-10 px-3.5 rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#0B1518] text-sm focus:outline-none focus:border-[#267C78]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#123B45] dark:text-[#ECF3F4] mb-1.5">
                  {t.admin.productDescLabel}
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder={t.admin.productDescPlaceholder}
                  className="w-full p-3.5 rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#0B1518] text-sm focus:outline-none focus:border-[#267C78]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#123B45] dark:text-[#ECF3F4] mb-1.5">
                    {t.admin.productBrandLabel}
                  </label>
                  <select
                    value={formBrandId}
                    onChange={(e) => setFormBrandId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#0B1518] text-sm focus:outline-none focus:border-[#267C78]"
                  >
                    <option value="">{t.admin.selectBrandPlaceholder}</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#123B45] dark:text-[#ECF3F4] mb-1.5">
                    {t.admin.productCategoryLabel}
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#0B1518] text-sm focus:outline-none focus:border-[#267C78]"
                  >
                    <option value="">{t.admin.selectCategoryPlaceholder}</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload to Supabase Storage */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#123B45] dark:text-[#ECF3F4]">
                  {t.admin.productImageLabel}
                </label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <MedicalImage
                    src={formImageUrl}
                    alt={formName || 'Preview'}
                    containerClassName="w-20 h-20 rounded-xl border border-slate-200 dark:border-[#213B43] shrink-0"
                  />

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="h-9 px-3.5 rounded-lg bg-[#123B45] dark:bg-[#267C78] hover:opacity-95 text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer">
                        {uploadingImage ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {uploadingImage
                            ? t.admin.uploadingImage
                            : t.admin.uploadImageBtn}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingImage}
                          onChange={handleImageFileChange}
                          className="sr-only"
                        />
                      </label>
                    </div>

                    <input
                      type="text"
                      dir="ltr"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      placeholder={t.admin.imageUrlPlaceholder}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#0B1518] text-xs focus:outline-none focus:border-[#267C78]"
                    />
                    <p className="text-[11px] text-[#25343A]/65 dark:text-[#9AB2B8]">
                      {t.admin.imageUploadHint}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Pricing Tiers Section */}
              <div className="pt-4 border-t border-slate-100 dark:border-[#1D353C] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-base font-bold text-[#123B45] dark:text-[#ECF3F4]">
                      {t.admin.pricingTiersTitle}
                    </h3>
                    <p className="text-xs text-[#25343A]/70 dark:text-[#9AB2B8]">
                      {t.admin.pricingTiersSubtitle}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addTierRow}
                    className="h-9 px-3 rounded-lg border border-[#267C78] text-[#267C78] dark:text-[#63C2BC] hover:bg-[#E8F4F1] dark:hover:bg-[#172B31] text-xs font-semibold inline-flex items-center gap-1.5 self-start cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.admin.addTier}</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {formTiers.map((tier) => (
                    <div
                      key={tier.key}
                      className="p-3 rounded-xl border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8]/70 dark:bg-[#0B1518] grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                    >
                      <div className="sm:col-span-5">
                        <label className="block text-xs font-medium text-[#25343A]/80 dark:text-[#9AB2B8] mb-1">
                          {t.admin.unitsPerBundle}
                        </label>
                        <input
                          type="number"
                          min={1}
                          step={1}
                          dir="ltr"
                          value={tier.units_per_bundle}
                          onChange={(e) =>
                            updateTierRow(tier.key, 'units_per_bundle', e.target.value)
                          }
                          className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-[#213B43] bg-white dark:bg-[#112126] font-mono-num text-sm focus:outline-none focus:border-[#267C78]"
                        />
                      </div>

                      <div className="sm:col-span-5">
                        <label className="block text-xs font-medium text-[#25343A]/80 dark:text-[#9AB2B8] mb-1">
                          {t.admin.bundlePrice}
                        </label>
                        <input
                          type="number"
                          min="0.001"
                          step="0.001"
                          dir="ltr"
                          value={tier.bundle_price}
                          onChange={(e) =>
                            updateTierRow(tier.key, 'bundle_price', e.target.value)
                          }
                          placeholder="0.000"
                          className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-[#213B43] bg-white dark:bg-[#112126] font-mono-num text-sm focus:outline-none focus:border-[#267C78]"
                        />
                      </div>

                      <div className="sm:col-span-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeTierRow(tier.key)}
                          disabled={formTiers.length <= 1}
                          title={t.admin.removeTier}
                          aria-label={t.admin.removeTier}
                          className="h-9 px-3 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-[#1D353C] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  disabled={savingProduct}
                  className="h-10 px-4 rounded-lg border border-slate-200 dark:border-[#213B43] text-sm font-medium cursor-pointer"
                >
                  {t.admin.cancel}
                </button>
                <button
                  type="submit"
                  disabled={savingProduct || uploadingImage}
                  className="h-10 px-5 rounded-lg bg-[#267C78] hover:bg-[#1F6966] disabled:opacity-60 text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  {savingProduct && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{savingProduct ? t.admin.saving : t.admin.save}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={t.admin.confirmDeleteTitle}
        description={
          deleteTarget?.type === 'product'
            ? t.admin.confirmDeleteProductDesc(deleteTarget.name)
            : deleteTarget?.type === 'brand'
              ? t.admin.confirmDeleteBrandDesc(deleteTarget.name)
              : deleteTarget?.type === 'category'
                ? t.admin.confirmDeleteCategoryDesc(deleteTarget.name)
                : ''
        }
        confirmLabel={t.admin.confirmDeleteBtn}
        cancelLabel={t.admin.cancel}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
