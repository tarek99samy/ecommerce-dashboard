import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      countries: [],
      cities: [],
      areas: [],
      currencies: [],
      statuses: [],
      categories: [],
      subcategories: [],
      thirdcategories: [],
      categoryAttributes: [],
      productCategoryAttributes: [],
      products: [],
      ads: [],
      adpackages: [],
      userAdPackages: [],
      paidAds: [],
      chats: [],
      messages: [],
      articles: [],
      comments: [],
      users: [],
      genders: [
        { id: 0, name: 'ذكر' },
        { id: 1, name: 'أنثى' }
      ],
      languages: [
        { id: 'ar', name: 'العربية' },
        { id: 'en', name: 'الإنجليزية' }
      ],
      roles: [
        { id: 0, name: 'مستخدم' },
        { id: 1, name: 'متحكم كامل' },
        { id: 2, name: 'مشرف' }
      ],
      ratingTypes: [
        { id: 1, name: 'تقييم المنتج' },
        { id: 2, name: 'تعليق على المنتج' },
        { id: 3, name: 'ابلاغ للمشرف' }
      ],
      fieldTypes: [
        { id: 'number', name: 'رقم' },
        { id: 'text', name: 'نص' },
        { id: 'date', name: 'تاريخ' },
        { id: 'dropdown', name: 'قائمة' }
      ],
      yesNoChoicesOptional: [
        { id: null, name: 'عدم التحديد' },
        { id: 0, name: 'لا' },
        { id: 1, name: 'نعم' }
      ],
      yesNoChoicesMandatory: [
        { id: 0, name: 'لا' },
        { id: 1, name: 'نعم' }
      ],
      paidAdSettingTypes: [
        { id: 1, name: 'ايام الظهور' },
        { id: 2, name: 'مكان الظهور' }
      ],
      archiveEntityTypes: [
        { id: 'article', name: 'منشور' },
        { id: 'ad', name: 'إعلان' }
      ],
      reportEntityTypes: [
        { id: 'comment', name: 'تعليق' },
        { id: 'message', name: 'رسالة' }
      ],
      setEntity: (entityName, data) => set({ [entityName]: data })
    }),
    { name: 'ecommerce-dashboard', getStorage: () => localStorage }
  )
);

export default useStore;
