export type Language = 'ar' | 'en';

export interface TranslationDictionary {
  meta: {
    pageTitle: string;
    adminTitle: string;
  };
  brand: {
    name: string;
    shortName: string;
    heroAlt: string;
  };
  nav: {
    mainAria: string;
    mobileAria: string;
    home: string;
    products: string;
    cart: string;
    cartAria: (count: number) => string;
    switchToLight: string;
    switchToDark: string;
    openMenu: string;
    languageSelectorAria: string;
  };
  footer: {
    tagline: string;
    store: string;
    cart: string;
  };
  home: {
    kicker: string;
    heroTitle: string;
    heroSubtitle: string;
    shopNow: string;
    catalogTitle: string;
    catalogSubtitle: string;
    resultsCount: (shown: number, total: number) => string;
    searchPlaceholder: string;
    searchAria: string;
    clearSearchAria: string;
    clearFilters: string;
    categoryFilterLabel: string;
    allCategories: string;
    brandFilterLabel: string;
    allBrands: string;
    supabaseTitle: string;
    supabaseDesc: string;
    supabaseStepsTitle: string;
    supabaseStep1: string;
    supabaseStep2: string;
    errorTitle: string;
    retry: string;
    emptyTitle: string;
    emptyDesc: string;
    showAllProducts: string;
  };
  product: {
    defaultBrand: string;
    defaultCategory: string;
    chooseOffer: string;
    oneOffer: string;
    offersCount: (count: number) => string;
    availableOffersOne: string;
    availableOffersMany: (count: number) => string;
    noTiers: string;
    addToCart: string;
    addOfferToCart: string;
    details: string;
    addedToastTitle: string;
    addedToastDesc: (productName: string, bundleLabel: string, price: string) => string;
    addedDetailToastDesc: (qty: number, bundleLabel: string, total: string) => string;
    noValidTierToast: string;
    invalidQuantityToast: string;
    breadcrumbAria: string;
    breadcrumbCatalog: string;
    offerExplain: string;
    bundleTitle: (bundleLabel: string) => string;
    bundleContains: (units: number) => string;
    bundlePriceLabel: string;
    quantityLabel: string;
    actualPacksLabel: string;
    packWord: (count: number) => string;
    decreaseQtyAria: string;
    increaseQtyAria: string;
    qtyInputAria: string;
    calculatedTotalLabel: (qty: number, unitPrice: string) => string;
    autoPriceNote: string;
    viewCart: string;
    continueShopping: string;
    notFoundTitle: string;
    notFoundDesc: string;
    backToCatalog: string;
    loadErrorTitle: string;
    backToStore: string;
    supabaseRequiredDesc: string;
  };
  cart: {
    pageTitle: string;
    pageSubtitle: string;
    independentNote: string;
    emptyTitle: string;
    emptyDesc: string;
    clearCart: string;
    confirmClearTitle: string;
    confirmClearDesc: string;
    confirmClearBtn: string;
    cancelBtn: string;
    clearedToast: string;
    removedToast: string;
    removeItem: string;
    selectedOffer: string;
    unitsPerBundle: string;
    bundlesCount: string;
    actualPacksCount: string;
    pricePerBundle: string;
    lineTotal: string;
    summaryTitle: string;
    subtotal: string;
    totalBundles: string;
    totalPacks: string;
    grandTotal: string;
    continueShopping: string;
    itemsLinesCount: (count: number) => string;
    decreaseQtyAria: string;
    increaseQtyAria: string;
    qtyInputAria: string;
    invalidQtyToast: string;
    promoCodeLabel: string;
    promoCodePlaceholder: string;
    applyPromoBtn: string;
    removePromoBtn: string;
    promoAppliedToast: (code: string, percent: number) => string;
    promoInvalidToast: string;
    promoAlreadyAppliedToast: string;
    promoRemovedToast: string;
    discountLabel: (percent: number) => string;
    discountAmount: string;
  };
  adminAuth: {
    areaBadge: string;
    loginTitle: string;
    loginSubtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    signInBtn: string;
    signingInBtn: string;
    backToStorefront: string;
    notAdminError: string;
    invalidCredentialsError: string;
    supabaseMissingTitle: string;
    supabaseMissingDesc: string;
    firstAdminHintTitle: string;
    firstAdminHintBody: string;
    logoutBtn: string;
    loggedOutToast: string;
    checkingAccess: string;
  };
  admin: {
    navTitle: string;
    viewStore: string;
    pageTitle: string;
    pageSubtitle: string;
    refreshData: string;
    tabProducts: string;
    tabBrands: string;
    tabCategories: string;
    totalProducts: string;
    totalBrands: string;
    totalCategories: string;
    totalTiers: string;
    searchProductsPlaceholder: string;
    filterAllBrands: string;
    filterAllCategories: string;
    createProduct: string;
    editProduct: string;
    deleteProduct: string;
    viewProduct: string;
    colImage: string;
    colName: string;
    colBrand: string;
    colCategory: string;
    colOffers: string;
    colActions: string;
    noProductsFound: string;
    productFormCreateTitle: string;
    productFormEditTitle: string;
    productNameLabel: string;
    productNamePlaceholder: string;
    productDescLabel: string;
    productDescPlaceholder: string;
    productBrandLabel: string;
    selectBrandPlaceholder: string;
    productCategoryLabel: string;
    selectCategoryPlaceholder: string;
    productImageLabel: string;
    uploadImageBtn: string;
    uploadingImage: string;
    imageUrlPlaceholder: string;
    imageUploadHint: string;
    pricingTiersTitle: string;
    pricingTiersSubtitle: string;
    unitsPerBundle: string;
    bundlePrice: string;
    addTier: string;
    removeTier: string;
    save: string;
    saving: string;
    cancel: string;
    confirmDeleteTitle: string;
    confirmDeleteProductDesc: (name: string) => string;
    confirmDeleteBrandDesc: (name: string) => string;
    confirmDeleteCategoryDesc: (name: string) => string;
    confirmDeleteBtn: string;
    brandInputPlaceholder: string;
    addBrandBtn: string;
    categoryInputPlaceholder: string;
    addCategoryBtn: string;
    editBtn: string;
    deleteBtn: string;
    linkedProductsCount: (count: number) => string;
    cannotDeleteBrandInUse: string;
    cannotDeleteCategoryInUse: string;
    valNameRequired: string;
    valBrandRequired: string;
    valCategoryRequired: string;
    valAtLeastOneTier: string;
    valInvalidUnits: string;
    valInvalidPrice: string;
    valBrandNameRequired: string;
    valCategoryNameRequired: string;
    toastProductSaved: string;
    toastProductDeleted: string;
    toastBrandAdded: string;
    toastBrandUpdated: string;
    toastBrandDeleted: string;
    toastCategoryAdded: string;
    toastCategoryUpdated: string;
    toastCategoryDeleted: string;
    toastImageUploaded: string;
    toastImageUploadFailed: string;
  };
  errors: {
    loadCatalogFallback: string;
    loadProductFallback: string;
    supabaseNotConfigured: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  ar: {
    meta: {
      pageTitle: 'مجموعة العناية الوطنية | متجر المستلزمات الطبية',
      adminTitle: 'مجموعة العناية الوطنية | لوحة تحكم الإدارة',
    },
    brand: {
      name: 'مجموعة العناية الوطنية',
      shortName: 'العناية الوطنية',
      heroAlt: 'مستلزمات وأجهزة طبية متنوعة من مجموعة العناية الوطنية',
    },
    nav: {
      mainAria: 'التنقل الرئيسي',
      mobileAria: 'التنقل على الجوال',
      home: 'الرئيسية',
      products: 'المنتجات',
      cart: 'السلة',
      cartAria: (count) => `سلة التسوق (${count} باقات)`,
      switchToLight: 'الوضع الفاتح',
      switchToDark: 'الوضع الداكن',
      openMenu: 'قائمة التنقل',
      languageSelectorAria: 'اختيار اللغة',
    },
    footer: {
      tagline: 'متجر المستلزمات والأجهزة الطبية — الأسعار بالدينار الكويتي (د.ك)',
      store: 'المتجر',
      cart: 'سلة التسوق',
    },
    home: {
      kicker: '🏥 مجموعة العناية الوطنية · المستلزمات والأجهزة الطبية',
      heroTitle: 'تجهيزات ومستلزمات طبية موثوقة للعيادات والمنازل',
      heroSubtitle:
        'تصفح الكتالوج الطبي المتكامل واختر بين الباقات المتعددة بمرونة كاملة، مع تسعير شفاف ومباشر بالدينار الكويتي لكل عرض.',
      shopNow: 'تسوق الآن',
      catalogTitle: 'كتالوج المنتجات الطبية',
      catalogSubtitle:
        'كل باقة تمثل عرضاً مستقلاً بعدد عبوات وسعر إجمالي محدد بالدينار الكويتي',
      resultsCount: (shown, total) => `عرض ${shown} من أصل ${total} منتجات`,
      searchPlaceholder: 'ابحث باسم المنتج، الوصف، أو العلامة التجارية...',
      searchAria: 'البحث في المنتجات',
      clearSearchAria: 'مسح نص البحث',
      clearFilters: 'مسح الفلاتر',
      categoryFilterLabel: 'التصنيف الطبي',
      allCategories: 'جميع الفئات',
      brandFilterLabel: 'العلامة التجارية',
      allBrands: 'جميع العلامات',
      supabaseTitle: 'بانتظار ربط قاعدة بيانات Supabase',
      supabaseDesc:
        'تعتمد هذه المنصة على قاعدة بيانات PostgreSQL حقيقية عبر Supabase لعرض المنتجات، العلامات التجارية، التصنيفات، ومستويات التسعير بدون بيانات وهمية.',
      supabaseStepsTitle: 'الخطوات المطلوبة لتفعيل البيانات:',
      supabaseStep1:
        '1. تزويد رابط المشروع ومفتاح الوصول (VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY).',
      supabaseStep2:
        '2. تنفيذ ملف الجداول وسياسات الأمان والبيانات الأولية المجهز في supabase/schema.sql.',
      errorTitle: 'تعذر تحميل المنتجات من قاعدة البيانات',
      retry: 'إعادة المحاولة',
      emptyTitle: 'لا توجد منتجات مطابقة لبحثك',
      emptyDesc:
        'جرّب تعديل كلمات البحث أو إعادة تعيين فلاتر العلامة التجارية والتصنيف.',
      showAllProducts: 'عرض جميع المنتجات',
    },
    product: {
      defaultBrand: 'علامة تجارية',
      defaultCategory: 'تصنيف طبي',
      chooseOffer: 'اختار العرض المناسب ليك',
      oneOffer: 'عرض واحد',
      offersCount: (count) => `${count} عروض`,
      availableOffersOne: 'عرض واحد متاح',
      availableOffersMany: (count) => `${count} عروض متاحة`,
      noTiers: 'لا توجد عروض تسعير مضافة لهذا المنتج بعد.',
      addToCart: 'أضف للسلة',
      addOfferToCart: 'أضف العرض للسلة',
      details: 'التفاصيل',
      addedToastTitle: 'تمت إضافة المنتج للسلة بنجاح',
      addedToastDesc: (productName, bundleLabel, price) =>
        `${productName} — باقة ${bundleLabel} (${price})`,
      addedDetailToastDesc: (qty, bundleLabel, total) =>
        `${qty} × باقة (${bundleLabel}) — الإجمالي: ${total}`,
      noValidTierToast: 'يرجى اختيار عرض تسعير صالح قبل الإضافة للسلة',
      invalidQuantityToast: 'يجب أن تكون الكمية رقماً صحيحاً موجباً (1 على الأقل)',
      breadcrumbAria: 'مسار الصفحة',
      breadcrumbCatalog: 'كتالوج المنتجات',
      offerExplain:
        'كل عرض يمثل باقة مستقلة بسعرها الإجمالي الخاص ولا يُحسب كسعر للعبوة المفردة.',
      bundleTitle: (bundleLabel) => `باقة ${bundleLabel}`,
      bundleContains: (units) =>
        `تحتوي على ${units} ${units === 1 ? 'عبوة' : 'عبوات'} داخل الباقة`,
      bundlePriceLabel: 'سعر الباقة',
      quantityLabel: 'عدد الباقات المطلوبة',
      actualPacksLabel: 'إجمالي العبوات الفعلية:',
      packWord: (count) => (count === 1 ? 'عبوة' : 'عبوات'),
      decreaseQtyAria: 'إنقاص عدد الباقات',
      increaseQtyAria: 'زيادة عدد الباقات',
      qtyInputAria: 'عدد الباقات',
      calculatedTotalLabel: (qty, unitPrice) =>
        `💰 الإجمالي المحسوب (${qty} × ${unitPrice})`,
      autoPriceNote:
        'السعر بيتحدث تلقائيًا حسب الكمية — يتم شراء باقات كاملة وليس عبوات منفردة.',
      viewCart: 'عرض السلة',
      continueShopping: 'متابعة التسوق',
      notFoundTitle: 'المنتج غير موجود',
      notFoundDesc: 'قد يكون هذا المنتج قد تم حذفه أو أن الرابط غير صحيح.',
      backToCatalog: 'العودة إلى كتالوج المنتجات',
      loadErrorTitle: 'تعذر تحميل بيانات المنتج',
      backToStore: 'العودة للمتجر',
      supabaseRequiredDesc:
        'يرجى ربط قاعدة بيانات Supabase أولاً لعرض تفاصيل المنتج وعروض التسعير الحقيقية.',
    },
    cart: {
      pageTitle: '🛍️ سلة التسوق',
      pageSubtitle: 'مراجعة الباقات المختارة وحساب الكميات والإجمالي بالدينار الكويتي',
      independentNote: 'كل عرض بيتم حسابه بشكل مستقل — العروض المختلفة لنفس المنتج تظهر في سطور منفصلة.',
      emptyTitle: 'مفيش منتجات في السلة حاليًا',
      emptyDesc: 'ابدأ بتصفح المستلزمات والأجهزة الطبية وإضافة الباقات المناسبة.',
      clearCart: 'تفريغ السلة',
      confirmClearTitle: 'هل أنت متأكد من تفريغ السلة؟',
      confirmClearDesc: 'سيتم إزالة جميع الباقات المضافة من سلة التسوق الحالية.',
      confirmClearBtn: 'نعم، تفريغ السلة',
      cancelBtn: 'إلغاء',
      clearedToast: 'تم تفريغ سلة التسوق',
      removedToast: 'تمت إزالة العرض من السلة',
      removeItem: 'حذف',
      selectedOffer: 'العرض المختار',
      unitsPerBundle: 'عبوات في الباقة',
      bundlesCount: 'عدد الباقات',
      actualPacksCount: 'إجمالي العبوات الفعلية',
      pricePerBundle: 'سعر الباقة',
      lineTotal: 'إجمالي السطر',
      summaryTitle: 'ملخص الطلب',
      subtotal: 'المجموع الفرعي',
      totalBundles: 'إجمالي الباقات',
      totalPacks: 'إجمالي العبوات الفعلية',
      grandTotal: 'الإجمالي الكلي',
      continueShopping: 'متابعة التسوق',
      itemsLinesCount: (count) =>
        count === 1 ? 'عرض واحد في السلة' : `${count} عروض في السلة`,
      decreaseQtyAria: 'إنقاص عدد الباقات',
      increaseQtyAria: 'زيادة عدد الباقات',
      qtyInputAria: 'عدد الباقات',
      invalidQtyToast: 'الكمية يجب أن تكون رقماً صحيحاً موجباً',
      promoCodeLabel: 'كوبون الخصم',
      promoCodePlaceholder: 'أدخل كود الخصم (مثال: PROMO50)',
      applyPromoBtn: 'تطبيق',
      removePromoBtn: 'إزالة الكوبون',
      promoAppliedToast: (code, percent) => `تم تفعيل كود الخصم ${code} بنجاح! خصم ${percent}%`,
      promoInvalidToast: 'كود الخصم غير صحيح أو غير متوفر',
      promoAlreadyAppliedToast: 'تم تطبيق كود الخصم هذا بالفعل',
      promoRemovedToast: 'تمت إزالة كود الخصم',
      discountLabel: (percent) => `خصم الكوبون (${percent}%)`,
      discountAmount: 'قيمة الخصم',
    },
    adminAuth: {
      areaBadge: 'منطقة الإدارة المحمية',
      loginTitle: 'تسجيل دخول الإدارة',
      loginSubtitle: 'أدخل البريد الإلكتروني وكلمة المرور لحساب المسؤول المعتمد في Supabase',
      emailLabel: 'البريد الإلكتروني',
      emailPlaceholder: 'admin@example.com',
      passwordLabel: 'كلمة المرور',
      passwordPlaceholder: '••••••••',
      signInBtn: 'تسجيل الدخول',
      signingInBtn: 'جاري التحقق...',
      backToStorefront: 'العودة لمتجر العملاء',
      notAdminError: 'هذا الحساب مسجل كعميل ولا يملك صلاحيات الإدارة.',
      invalidCredentialsError: 'بيانات الدخول غير صحيحة أو الحساب غير مفعل.',
      supabaseMissingTitle: 'يلزم ربط Supabase لتفعيل دخول الإدارة',
      supabaseMissingDesc:
        'تأكد من إعداد VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY وتنفيذ supabase/schema.sql أولاً.',
      firstAdminHintTitle: 'تذكير إنشاء أول مسؤول:',
      firstAdminHintBody:
        'أنشئ المستخدم من Supabase Auth ثم نفّذ استعلام ترقية الدور إلى admin في جدول profiles عبر SQL Editor.',
      logoutBtn: 'تسجيل الخروج',
      loggedOutToast: 'تم تسجيل الخروج بنجاح',
      checkingAccess: 'جاري التحقق من صلاحيات الإدارة...',
    },
    admin: {
      navTitle: 'لوحة إدارة العناية الوطنية',
      viewStore: 'عرض المتجر',
      pageTitle: '⚙️ لوحة تحكم الإدارة',
      pageSubtitle: 'إدارة الكتالوج الطبي، العلامات التجارية، التصنيفات، وعروض التسعير الديناميكية',
      refreshData: 'تحديث البيانات',
      tabProducts: 'المنتجات والتسعير',
      tabBrands: 'العلامات التجارية',
      tabCategories: 'التصنيفات',
      totalProducts: 'إجمالي المنتجات',
      totalBrands: 'إجمالي العلامات',
      totalCategories: 'إجمالي التصنيفات',
      totalTiers: 'إجمالي عروض الأسعار',
      searchProductsPlaceholder: 'ابحث في المنتجات...',
      filterAllBrands: 'كل العلامات',
      filterAllCategories: 'كل التصنيفات',
      createProduct: 'إضافة منتج جديد',
      editProduct: 'تعديل',
      deleteProduct: 'حذف',
      viewProduct: 'معاينة',
      colImage: 'الصورة',
      colName: 'المنتج',
      colBrand: 'العلامة التجارية',
      colCategory: 'التصنيف',
      colOffers: 'العروض',
      colActions: 'الإجراءات',
      noProductsFound: 'لا توجد منتجات مطابقة للبحث أو التصفية.',
      productFormCreateTitle: 'إضافة منتج طبي جديد',
      productFormEditTitle: 'تعديل بيانات المنتج',
      productNameLabel: 'اسم المنتج *',
      productNamePlaceholder: 'مثال: جهاز قياس ضغط الدم الرقمي',
      productDescLabel: 'وصف المنتج',
      productDescPlaceholder: 'اكتب وصفاً واضحاً لمواصفات واستخدامات المنتج...',
      productBrandLabel: 'العلامة التجارية *',
      selectBrandPlaceholder: 'اختر العلامة التجارية',
      productCategoryLabel: 'التصنيف *',
      selectCategoryPlaceholder: 'اختر التصنيف',
      productImageLabel: 'صورة المنتج (Supabase Storage)',
      uploadImageBtn: 'رفع صورة إلى Supabase',
      uploadingImage: 'جاري الرفع...',
      imageUrlPlaceholder: 'أو أدخل رابط الصورة مباشرة (/assets/... أو https://...)',
      imageUploadHint: 'يتم رفع الصور بأمان إلى حاوية product-images بسياسات صلاحيات الإدارة فقط.',
      pricingTiersTitle: 'عروض التسعير (الباقات)',
      pricingTiersSubtitle: 'يمكنك إضافة عدد غير محدود من العروض. كل عرض مستقل بعدد العبوات وسعر الباقة.',
      unitsPerBundle: 'عدد العبوات في الباقة *',
      bundlePrice: 'سعر الباقة (د.ك) *',
      addTier: 'إضافة عرض آخر',
      removeTier: 'حذف العرض',
      save: 'حفظ التغييرات',
      saving: 'جاري الحفظ...',
      cancel: 'إلغاء',
      confirmDeleteTitle: 'تأكيد الحذف',
      confirmDeleteProductDesc: (name) =>
        `هل أنت متأكد من حذف المنتج "${name}"؟ سيتم حذف جميع عروض التسعير المرتبطة به نهائياً.`,
      confirmDeleteBrandDesc: (name) =>
        `هل أنت متأكد من حذف العلامة التجارية "${name}"؟`,
      confirmDeleteCategoryDesc: (name) =>
        `هل أنت متأكد من حذف التصنيف "${name}"؟`,
      confirmDeleteBtn: 'نعم، تأكيد الحذف',
      brandInputPlaceholder: 'اسم العلامة التجارية الجديدة...',
      addBrandBtn: 'إضافة علامة',
      categoryInputPlaceholder: 'اسم التصنيف الجديد...',
      addCategoryBtn: 'إضافة تصنيف',
      editBtn: 'تعديل',
      deleteBtn: 'حذف',
      linkedProductsCount: (count) => `${count} منتجات مرتبطة`,
      cannotDeleteBrandInUse:
        'لا يمكن حذف علامة تجارية مرتبطة بمنتجات حالية. قم بنقل المنتجات أو حذفها أولاً.',
      cannotDeleteCategoryInUse:
        'لا يمكن حذف تصنيف مرتبط بمنتجات حالية. قم بنقل المنتجات أو حذفها أولاً.',
      valNameRequired: 'اسم المنتج مطلوب',
      valBrandRequired: 'يرجى اختيار العلامة التجارية',
      valCategoryRequired: 'يرجى اختيار التصنيف',
      valAtLeastOneTier: 'يجب إضافة عرض تسعير واحد على الأقل',
      valInvalidUnits: 'عدد العبوات يجب أن يكون رقماً صحيحاً أكبر من 0',
      valInvalidPrice: 'سعر الباقة يجب أن يكون أكبر من 0',
      valBrandNameRequired: 'اسم العلامة التجارية مطلوب',
      valCategoryNameRequired: 'اسم التصنيف مطلوب',
      toastProductSaved: 'تم حفظ المنتج وعروض التسعير بنجاح',
      toastProductDeleted: 'تم حذف المنتج بنجاح',
      toastBrandAdded: 'تمت إضافة العلامة التجارية بنجاح',
      toastBrandUpdated: 'تم تعديل العلامة التجارية بنجاح',
      toastBrandDeleted: 'تم حذف العلامة التجارية بنجاح',
      toastCategoryAdded: 'تمت إضافة التصنيف بنجاح',
      toastCategoryUpdated: 'تم تعديل التصنيف بنجاح',
      toastCategoryDeleted: 'تم حذف التصنيف بنجاح',
      toastImageUploaded: 'تم رفع الصورة إلى Supabase Storage بنجاح',
      toastImageUploadFailed: 'فشل رفع الصورة',
    },
    errors: {
      loadCatalogFallback: 'حدث خطأ أثناء تحميل المنتجات من قاعدة البيانات',
      loadProductFallback: 'حدث خطأ أثناء تحميل تفاصيل المنتج',
      supabaseNotConfigured:
        'لم يتم ربط قاعدة بيانات Supabase بعد. يرجى إضافة بيانات الاتصال للمتابعة.',
    },
  },
  en: {
    meta: {
      pageTitle: 'National Care Group | Medical Supplies Store',
      adminTitle: 'National Care Group | Admin Dashboard',
    },
    brand: {
      name: 'National Care Group',
      shortName: 'NCG Medical',
      heroAlt: 'Assorted medical supplies and diagnostic devices from National Care Group',
    },
    nav: {
      mainAria: 'Main navigation',
      mobileAria: 'Mobile navigation',
      home: 'Home',
      products: 'Products',
      cart: 'Cart',
      cartAria: (count) => `Shopping cart (${count} bundles)`,
      switchToLight: 'Light mode',
      switchToDark: 'Dark mode',
      openMenu: 'Navigation menu',
      languageSelectorAria: 'Language selector',
    },
    footer: {
      tagline: 'Medical Supplies & Equipment Marketplace — Prices in Kuwaiti Dinar (KWD)',
      store: 'Storefront',
      cart: 'Shopping Cart',
    },
    home: {
      kicker: '🏥 National Care Group · Medical Supplies & Diagnostics',
      heroTitle: 'Trusted Medical Equipment & Supplies for Clinics and Homes',
      heroSubtitle:
        'Browse our medical catalog and choose flexibly across multi-pack bundle tiers with transparent, direct pricing in KWD.',
      shopNow: 'Shop Now',
      catalogTitle: 'Medical Product Catalog',
      catalogSubtitle:
        'Each bundle tier is an independent offer with its own pack count and total price in KWD',
      resultsCount: (shown, total) => `Showing ${shown} of ${total} products`,
      searchPlaceholder: 'Search by product name, description, or brand...',
      searchAria: 'Search products',
      clearSearchAria: 'Clear search text',
      clearFilters: 'Clear Filters',
      categoryFilterLabel: 'Medical Category',
      allCategories: 'All Categories',
      brandFilterLabel: 'Brand',
      allBrands: 'All Brands',
      supabaseTitle: 'Waiting for Supabase Database Connection',
      supabaseDesc:
        'This storefront connects directly to a live PostgreSQL database on Supabase to serve products, brands, categories, and pricing tiers with zero mock data.',
      supabaseStepsTitle: 'Required steps to enable live data:',
      supabaseStep1:
        '1. Provide your Supabase URL and Anon Key (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).',
      supabaseStep2:
        '2. Run the schema, RLS policies, and initial seed script located in supabase/schema.sql.',
      errorTitle: 'Unable to load products from the database',
      retry: 'Try Again',
      emptyTitle: 'No products match your search',
      emptyDesc:
        'Try adjusting your search keywords or resetting the brand and category filters.',
      showAllProducts: 'Show All Products',
    },
    product: {
      defaultBrand: 'Brand',
      defaultCategory: 'Medical Category',
      chooseOffer: 'Choose your bundle offer',
      oneOffer: '1 offer',
      offersCount: (count) => `${count} offers`,
      availableOffersOne: '1 offer available',
      availableOffersMany: (count) => `${count} offers available`,
      noTiers: 'No pricing tiers have been added for this product yet.',
      addToCart: 'Add to Cart',
      addOfferToCart: 'Add Selected Offer to Cart',
      details: 'Details',
      addedToastTitle: 'Added to cart successfully',
      addedToastDesc: (productName, bundleLabel, price) =>
        `${productName} — ${bundleLabel} (${price})`,
      addedDetailToastDesc: (qty, bundleLabel, total) =>
        `${qty} × ${bundleLabel} — Total: ${total}`,
      noValidTierToast: 'Please select a valid pricing offer before adding to cart',
      invalidQuantityToast: 'Quantity must be a positive integer (at least 1)',
      breadcrumbAria: 'Breadcrumb',
      breadcrumbCatalog: 'Product Catalog',
      offerExplain:
        'Each offer represents an independent bundle with its own total bundle price (not a per-pack price).',
      bundleTitle: (bundleLabel) => `${bundleLabel} Bundle`,
      bundleContains: (units) =>
        `Contains ${units} ${units === 1 ? 'pack' : 'packs'} per bundle`,
      bundlePriceLabel: 'Bundle Price',
      quantityLabel: 'Number of Bundles',
      actualPacksLabel: 'Total actual packs:',
      packWord: (count) => (count === 1 ? 'pack' : 'packs'),
      decreaseQtyAria: 'Decrease bundle quantity',
      increaseQtyAria: 'Increase bundle quantity',
      qtyInputAria: 'Bundle quantity',
      calculatedTotalLabel: (qty, unitPrice) =>
        `💰 Calculated Total (${qty} × ${unitPrice})`,
      autoPriceNote:
        'Price updates automatically with quantity — purchases are made in complete bundles.',
      viewCart: 'View Cart',
      continueShopping: 'Continue Shopping',
      notFoundTitle: 'Product Not Found',
      notFoundDesc: 'This product may have been removed or the link is invalid.',
      backToCatalog: 'Back to Product Catalog',
      loadErrorTitle: 'Unable to load product details',
      backToStore: 'Back to Store',
      supabaseRequiredDesc:
        'Please connect your Supabase database first to view real product details and pricing offers.',
    },
    cart: {
      pageTitle: '🛍️ Shopping Cart',
      pageSubtitle: 'Review your selected bundles, actual pack counts, and totals in KWD',
      independentNote:
        'Each offer is calculated independently — different pricing tiers for the same product stay as separate cart lines.',
      emptyTitle: 'Your cart is currently empty',
      emptyDesc: 'Browse medical supplies and equipment to add suitable bundle offers.',
      clearCart: 'Clear Cart',
      confirmClearTitle: 'Clear Shopping Cart?',
      confirmClearDesc: 'All bundle items in your current shopping cart will be removed.',
      confirmClearBtn: 'Yes, Clear Cart',
      cancelBtn: 'Cancel',
      clearedToast: 'Shopping cart cleared',
      removedToast: 'Offer removed from cart',
      removeItem: 'Remove',
      selectedOffer: 'Selected Offer',
      unitsPerBundle: 'Units per Bundle',
      bundlesCount: 'Bundles',
      actualPacksCount: 'Actual Packs',
      pricePerBundle: 'Price per Bundle',
      lineTotal: 'Line Total',
      summaryTitle: 'Order Summary',
      subtotal: 'Subtotal',
      totalBundles: 'Total Bundles',
      totalPacks: 'Total Actual Packs',
      grandTotal: 'Grand Total',
      continueShopping: 'Continue Shopping',
      itemsLinesCount: (count) =>
        count === 1 ? '1 offer in cart' : `${count} offers in cart`,
      decreaseQtyAria: 'Decrease bundle quantity',
      increaseQtyAria: 'Increase bundle quantity',
      qtyInputAria: 'Bundle quantity',
      invalidQtyToast: 'Quantity must be a positive integer',
      promoCodeLabel: 'Promo Code',
      promoCodePlaceholder: 'Enter promo code (e.g. PROMO50)',
      applyPromoBtn: 'Apply',
      removePromoBtn: 'Remove Code',
      promoAppliedToast: (code, percent) => `Promo code ${code} applied! ${percent}% off`,
      promoInvalidToast: 'Invalid or unrecognized promo code',
      promoAlreadyAppliedToast: 'This promo code is already applied',
      promoRemovedToast: 'Promo code removed',
      discountLabel: (percent) => `Promo Discount (${percent}%)`,
      discountAmount: 'Discount',
    },
    adminAuth: {
      areaBadge: 'Protected Admin Area',
      loginTitle: 'Admin Sign In',
      loginSubtitle: 'Sign in with your verified Supabase administrator email and password',
      emailLabel: 'Email Address',
      emailPlaceholder: 'admin@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      signInBtn: 'Sign In',
      signingInBtn: 'Verifying...',
      backToStorefront: 'Back to Customer Storefront',
      notAdminError: 'This account does not have administrator privileges.',
      invalidCredentialsError: 'Invalid email or password.',
      supabaseMissingTitle: 'Supabase Connection Required for Admin Login',
      supabaseMissingDesc:
        'Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY and run supabase/schema.sql first.',
      firstAdminHintTitle: 'First Admin Setup:',
      firstAdminHintBody:
        'Create the user in Supabase Auth, then set role = "admin" in public.profiles via the SQL Editor.',
      logoutBtn: 'Sign Out',
      loggedOutToast: 'Signed out successfully',
      checkingAccess: 'Verifying administrator access...',
    },
    admin: {
      navTitle: 'NCG Admin Console',
      viewStore: 'View Store',
      pageTitle: '⚙️ Admin Dashboard',
      pageSubtitle: 'Manage medical products, brands, categories, and dynamic bundle pricing tiers',
      refreshData: 'Refresh',
      tabProducts: 'Products & Pricing',
      tabBrands: 'Brands',
      tabCategories: 'Categories',
      totalProducts: 'Total Products',
      totalBrands: 'Total Brands',
      totalCategories: 'Total Categories',
      totalTiers: 'Total Pricing Offers',
      searchProductsPlaceholder: 'Search products...',
      filterAllBrands: 'All Brands',
      filterAllCategories: 'All Categories',
      createProduct: 'Create Product',
      editProduct: 'Edit',
      deleteProduct: 'Delete',
      viewProduct: 'View',
      colImage: 'Image',
      colName: 'Product',
      colBrand: 'Brand',
      colCategory: 'Category',
      colOffers: 'Offers',
      colActions: 'Actions',
      noProductsFound: 'No products match your search or filter criteria.',
      productFormCreateTitle: 'Create New Medical Product',
      productFormEditTitle: 'Edit Product',
      productNameLabel: 'Product Name *',
      productNamePlaceholder: 'e.g. Digital Blood Pressure Monitor',
      productDescLabel: 'Description',
      productDescPlaceholder: 'Enter product specifications and clinical use details...',
      productBrandLabel: 'Brand *',
      selectBrandPlaceholder: 'Select a brand',
      productCategoryLabel: 'Category *',
      selectCategoryPlaceholder: 'Select a category',
      productImageLabel: 'Product Image (Supabase Storage)',
      uploadImageBtn: 'Upload to Supabase Storage',
      uploadingImage: 'Uploading...',
      imageUrlPlaceholder: 'Or enter image path/URL (/assets/... or https://...)',
      imageUploadHint: 'Images are uploaded to the product-images bucket protected by admin-only RLS.',
      pricingTiersTitle: 'Bundle Pricing Tiers',
      pricingTiersSubtitle: 'Add unlimited pricing tiers. Each tier has an independent pack count and bundle price.',
      unitsPerBundle: 'Units per Bundle *',
      bundlePrice: 'Bundle Price (KWD) *',
      addTier: 'Add Another Offer',
      removeTier: 'Remove Offer',
      save: 'Save Changes',
      saving: 'Saving...',
      cancel: 'Cancel',
      confirmDeleteTitle: 'Confirm Deletion',
      confirmDeleteProductDesc: (name) =>
        `Are you sure you want to delete "${name}"? All associated pricing tiers will be permanently removed.`,
      confirmDeleteBrandDesc: (name) =>
        `Are you sure you want to delete the brand "${name}"?`,
      confirmDeleteCategoryDesc: (name) =>
        `Are you sure you want to delete the category "${name}"?`,
      confirmDeleteBtn: 'Yes, Delete',
      brandInputPlaceholder: 'New brand name...',
      addBrandBtn: 'Add Brand',
      categoryInputPlaceholder: 'New category name...',
      addCategoryBtn: 'Add Category',
      editBtn: 'Edit',
      deleteBtn: 'Delete',
      linkedProductsCount: (count) => `${count} linked products`,
      cannotDeleteBrandInUse:
        'Cannot delete a brand associated with existing products. Reassign or delete those products first.',
      cannotDeleteCategoryInUse:
        'Cannot delete a category associated with existing products. Reassign or delete those products first.',
      valNameRequired: 'Product name is required',
      valBrandRequired: 'Please select a brand',
      valCategoryRequired: 'Please select a category',
      valAtLeastOneTier: 'At least one pricing tier is required',
      valInvalidUnits: 'Units per bundle must be a positive integer greater than 0',
      valInvalidPrice: 'Bundle price must be greater than 0',
      valBrandNameRequired: 'Brand name is required',
      valCategoryNameRequired: 'Category name is required',
      toastProductSaved: 'Product and pricing tiers saved successfully',
      toastProductDeleted: 'Product deleted successfully',
      toastBrandAdded: 'Brand added successfully',
      toastBrandUpdated: 'Brand updated successfully',
      toastBrandDeleted: 'Brand deleted successfully',
      toastCategoryAdded: 'Category added successfully',
      toastCategoryUpdated: 'Category updated successfully',
      toastCategoryDeleted: 'Category deleted successfully',
      toastImageUploaded: 'Image uploaded to Supabase Storage',
      toastImageUploadFailed: 'Failed to upload image',
    },
    errors: {
      loadCatalogFallback: 'An error occurred while loading products from the database',
      loadProductFallback: 'An error occurred while loading product details',
      supabaseNotConfigured:
        'Supabase database is not connected yet. Please provide connection credentials to continue.',
    },
  },
};
