import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../services/ApiService';
import useStore from '../store/store';
import BasicTable from '../components/BasicTable';
import { Divider } from 'primereact/divider';

export default function Products() {
  const toast = useRef(null);
  const productObj = useRef(new ApiService('product'));
  const adObj = useRef(new ApiService('ad'));
  const adpackageObj = useRef(new ApiService('adpackage'));
  const statusObj = useRef(new ApiService('status'));
  const countryObj = useRef(new ApiService('country'));
  const areaObj = useRef(new ApiService('area'));
  const categoryObj = useRef(new ApiService('category'));
  const subcategoryObj = useRef(new ApiService('subcategory'));
  const thirdcategoryObj = useRef(new ApiService('thirdcategory'));
  const currencyObj = useRef(new ApiService('currency'));
  const subcategoryAttributeObj = useRef(new ApiService('subcategory-attribute'));
  const productAttributeObj = useRef(new ApiService('product-attribute'));
  const productFeedbackObj = useRef(new ApiService('product-feedback'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'المنتجات والاعلانات ومتعلقاتهم';
    if (useStore.getState().statuses.length === 0) {
      statusObj.current.getAll('statuses').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().countries.length === 0) {
      countryObj.current.getAll('countries').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().areas.length === 0) {
      areaObj.current.getAll('areas').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().categories.length === 0) {
      categoryObj.current.getAll('categories').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().subcategories.length === 0) {
      subcategoryObj.current
        .getAll('subcategories')
        .catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().thirdcategories.length === 0) {
      thirdcategoryObj.current
        .getAll('thirdcategories')
        .catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().currencies.length === 0) {
      currencyObj.current.getAll('currencies').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().adpackages.length === 0) {
      adpackageObj.current.getAll('adpackages').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
  }, []);

  useEffect(() => {
    if (loading && useStore.getState().statuses.length && useStore.getState().areas.length && useStore.getState().subcategories.length) {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [useStore.getState().statuses, useStore.getState().areas, useStore.getState().subcategories, loading]);

  return (
    <main className='p-3 flex flex-column align-items-center justify-content-center gap-3'>
      <h1>لوحة التحكم بالمنتجات و الاعلانات و متعلقاتهم</h1>
      <BasicTable
        tableTitle='عرض المنتجات'
        loading={loading}
        noDelete={true}
        singleCount={7}
        elementsName='products'
        getElements={productObj.current.getAll}
        addElement={productObj.current.addSingle}
        editElement={productObj.current.editSingle}
        uploadOptions={{ key: 'media', handler: productObj.current.uploadFile, deleteHandler: productObj.current.deleteFiles, multiple: true }}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          {
            type: 'text',
            field: 'name_en',
            header: 'الاسم الانجليزي',
            className: 'w-8rem dir-ltr',
            allowEdit: false,
            sortable: true,
            filterType: 'text'
          },
          { type: 'text', field: 'name_ar', header: 'الاسم العربي', className: 'w-8rem', allowEdit: false, sortable: true, filterType: 'text' },
          {
            type: 'text',
            field: 'description_en',
            header: 'الوصف الانجليزي',
            className: 'w-12rem dir-ltr',
            allowEdit: false,
            sortable: true,
            filterType: 'text'
          },
          { type: 'text', field: 'description_ar', header: 'الوصف العربي', className: 'w-12rem', allowEdit: false, sortable: true, filterType: 'text' },
          {
            type: 'dropdown',
            field: 'subcategory_id',
            header: 'التصنيف الفرعي',
            className: 'w-8rem',
            dropdownOptions: useStore.getState().subcategories,
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'thirdcategory_id',
            header: 'التصنيف الداخلي',
            className: 'w-8rem',
            dropdownOptions: useStore.getState().thirdcategories,
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'area_id',
            header: 'المدينة',
            className: 'w-4rem',
            dropdownOptions: useStore.getState().areas,
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'status_id',
            header: 'حالة المنتج',
            className: 'w-3rem',
            dropdownOptions: useStore.getState().statuses.filter((status) => status.id === 9 || status.id === 8),
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'number', field: 'price', header: 'السعر', className: 'w-8rem', allowEdit: false, sortable: true, filterType: 'number' },
          {
            type: 'dropdown',
            field: 'original_currency_id',
            header: 'العملة الاصلية',
            className: 'w-7rem',
            dropdownOptions: useStore.getState().currencies,
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'country_id',
            header: 'الدولة',
            className: 'w-3rem',
            dropdownOptions: useStore.getState().countries,
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'media', field: 'images', header: 'الصور' },
          { type: 'media', field: 'videos', header: 'الفيديوهات' }
        ]}
        formFields={[
          { type: 'text', name: 'name_en', placeholder: 'الاسم الانجليزي', required: true },
          { type: 'text', name: 'name_ar', placeholder: 'الاسم العربي', required: true },
          { type: 'text', name: 'description_en', placeholder: 'الوصف الانجليزي', required: false },
          { type: 'text', name: 'description_ar', placeholder: 'الوصف العربي', required: false },
          { type: 'dropdown', name: 'subcategory_id', placeholder: 'التصنيف الفرعي', dropdownOptions: useStore.getState().subcategories, required: true },
          {
            type: 'dependent-dropdown',
            name: 'thirdcategory_id',
            placeholder: 'التصنيف الداخلي',
            dropdownOptions: useStore.getState().thirdcategories,
            parentName: 'subcategory_id',
            required: false
          },
          {
            type: 'dropdown',
            name: 'status_id',
            placeholder: 'حالة المنتج',
            dropdownOptions: useStore.getState().statuses.filter((status) => status.id === 9 || status.id === 8),
            required: true
          },
          { type: 'dropdown', name: 'country_id', placeholder: 'الدولة', dropdownOptions: useStore.getState().countries, required: true },
          {
            type: 'dependent-dropdown',
            name: 'area_id',
            placeholder: 'المدينة',
            dropdownOptions: useStore
              .getState()
              .areas.map((area) => ({ ...area, country_id: useStore.getState().cities.find((city) => city.id === area.city_id).country_id })),
            parentName: 'country_id',
            required: true
          },
          { type: 'number', name: 'price', placeholder: 'السعر', required: true },
          {
            type: 'dropdown',
            name: 'original_currency_id',
            placeholder: 'العملة الاصلية',
            dropdownOptions: useStore.getState().currencies,
            required: true
          },
          { type: 'image', name: 'images', placeholder: 'الصور', required: false },
          { type: 'image', name: 'videos', placeholder: 'الفيديوهات', required: false }
        ]}
      />
      <Divider className='h-1rem surface-300' />
      <h3>
        (1) تقييم: نسبة التقييم من 1 الي 5 والتعليق اختياري. <br /> (2) تعليق: فقط التعليق بدون نسبة تقييم. <br /> (3) ابلاغ للمسئول: التعليق اختياري
      </h3>
      <BasicTable
        tableTitle='عرض تقييمات وتعليقات وابلاغات المنتجات'
        loading={loading}
        noDelete={true}
        noEdit={true}
        singleCount={6}
        elementsName='productFeedbacks'
        haveArabicName={false}
        getElements={productFeedbackObj.current.getAll}
        addElement={productFeedbackObj.current.addSingle}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          { type: 'dropdown', field: 'user_id', header: 'المستخدم', dropdownOptions: useStore.getState().users, sortable: true, filterType: 'dropdown' },
          {
            type: 'dropdown',
            field: 'ad_id',
            header: 'عنوان الاعلان (المنتج)',
            dropdownOptions: useStore
              .getState()
              .ads.map((ad) => ({ ...ad, name: useStore.getState().products.find((product) => product.id === ad.product_id)?.name })),
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'text', field: 'comment', header: 'التعليق', sortable: true, filterType: 'text' },
          { type: 'number', field: 'rating', header: 'نسبة التقييم', sortable: true, filterType: 'number' },
          {
            type: 'dropdown',
            field: 'type',
            header: 'نوع التقييم',
            dropdownOptions: useStore.getState().ratingTypes,
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'date', field: 'datetime', header: 'التاريخ', sortable: true, filterType: 'date' }
        ]}
      />
      <Divider className='h-1rem surface-300' />
      <h3>ملحوظة: عند اضافة اعلان يجب ان يكون المنتج والمستخدم متواجدين بالفعل</h3>
      <BasicTable
        tableTitle='عرض الاعلانات'
        loading={loading}
        noDelete={true}
        canArchive={true}
        singleCount={6}
        elementsName='ads'
        haveArabicName={false}
        getElements={adObj.current.getAll}
        addElement={adObj.current.addSingle}
        editElement={adObj.current.editSingle}
        archiveElement={adObj.current.archiveSingle}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          {
            type: 'dropdown',
            field: 'product_id',
            header: 'المنتج',
            className: 'w-9rem',
            dropdownOptions: useStore.getState().products,
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'user_id',
            header: 'المستخدم',
            className: 'w-9rem',
            dropdownOptions: useStore.getState().users,
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'ad_package_id',
            header: 'باقة الاعلانات',
            className: 'w-9rem',
            dropdownOptions: useStore.getState().adpackages,
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'text', field: 'seller_name', header: 'اسم البائع', className: 'w-9rem', allowEdit: false, sortable: true, filterType: 'text' },
          { type: 'text', field: 'seller_phone', header: 'رقم هاتف البائع', className: 'w-9rem', allowEdit: false, sortable: true, filterType: 'text' },
          {
            type: 'dropdown',
            field: 'status_id',
            header: 'حالة الاعلان',
            className: 'w-9rem',
            dropdownOptions: useStore.getState().statuses,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'country_id',
            header: 'الدولة',
            className: 'w-9rem',
            dropdownOptions: useStore.getState().countries,
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'date', field: 'datetime', header: 'تاريخ الاعلان', className: 'w-9rem', allowEdit: false, sortable: true, filterType: 'date' },
          { type: 'number', field: 'num_views', header: 'عدد المشاهدات', className: 'w-9rem', allowEdit: false, sortable: true, filterType: 'number' },
          { type: 'number', field: 'num_calls', header: 'عدد المكالمات', className: 'w-9rem', allowEdit: false, sortable: true, filterType: 'number' },
          {
            type: 'dropdown',
            field: 'allow_comments',
            header: 'فتح التعليقات',
            className: 'w-9rem',
            dropdownOptions: useStore.getState().yesNoChoicesMandatory,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'allow_calls',
            header: 'فتح المكالمات',
            className: 'w-9rem',
            dropdownOptions: useStore.getState().yesNoChoicesMandatory,
            sortable: true,
            filterType: 'dropdown'
          }
        ]}
        formFields={[
          { type: 'dropdown', name: 'product_id', placeholder: 'id المنتج', dropdownOptions: useStore.getState().products, required: true },
          { type: 'dropdown', name: 'user_id', placeholder: 'المستخدم', dropdownOptions: useStore.getState().users, required: true },
          { type: 'dropdown', name: 'ad_package_id', placeholder: 'باقة الاعلانات', dropdownOptions: useStore.getState().adpackages, required: false },
          { type: 'text', name: 'seller_name', placeholder: 'اسم البائع', required: false },
          { type: 'text', name: 'seller_phone', placeholder: 'رقم هاتف البائع', required: false },
          {
            type: 'dropdown',
            name: 'status_id',
            placeholder: 'حالة الاعلان',
            dropdownOptions: useStore.getState().statuses.filter((s) => s.id === 1 || s.id === 2),
            required: true
          },
          { type: 'dropdown', name: 'country_id', placeholder: 'الدولة', dropdownOptions: useStore.getState().countries, required: true },
          { type: 'date', name: 'datetime', placeholder: 'تاريخ الاعلان', required: false },
          { type: 'number', name: 'num_views', placeholder: 'عدد المشاهدات', required: false },
          { type: 'number', name: 'num_calls', placeholder: 'عدد المكالمات', required: false },
          {
            type: 'dropdown',
            name: 'allow_comments',
            placeholder: 'فتح التعليقات',
            dropdownOptions: useStore.getState().yesNoChoicesMandatory,
            required: true
          },
          {
            type: 'dropdown',
            name: 'allow_calls',
            placeholder: 'فتح المكالمات',
            dropdownOptions: useStore.getState().yesNoChoicesMandatory,
            required: true
          }
        ]}
      />
      <Divider className='h-1rem surface-300' />
      <h3>لاضافة خيار ضمن الخيارات: قم بكتابة الخيار ثم اضغط enter</h3>
      <BasicTable
        tableTitle='عرض حقول التصنيفات'
        loading={loading}
        singleCount={4}
        elementsName='subcategoryAttributes'
        getElements={subcategoryAttributeObj.current.getAll}
        addElement={subcategoryAttributeObj.current.addSingle}
        editElement={subcategoryAttributeObj.current.editSingle}
        deleteElement={subcategoryAttributeObj.current.deleteSingle}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          { type: 'text', field: 'name_en', header: 'الاسم الانجليزي', className: 'dir-ltr', sortable: true, filterType: 'text' },
          { type: 'text', field: 'name_ar', header: 'الاسم العربي', sortable: true, filterType: 'text' },
          {
            type: 'dropdown',
            field: 'is_required',
            header: 'يجب ادخاله؟',
            dropdownOptions: useStore.getState().yesNoChoicesMandatory,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'subcategory_id',
            header: 'التصنيف الفرعي',
            dropdownOptions: useStore.getState().subcategories,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'status_id',
            header: 'الحالة',
            dropdownOptions: useStore.getState().statuses.filter((s) => s.id === 1 || s.id === 2),
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'data_type',
            header: 'نوع الحقل',
            dropdownOptions: useStore.getState().fieldTypes,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'allow_multiselect',
            header: 'سماح بالاختيار المتعدد؟',
            dropdownOptions: useStore.getState().yesNoChoicesOptional,
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'chips', field: 'options', header: 'الخيارات', className: 'dir-ltr' }
        ]}
        formFields={[
          { type: 'text', name: 'name_en', placeholder: 'الاسم الانجليزي', required: true },
          { type: 'text', name: 'name_ar', placeholder: 'الاسم العربي', required: true },
          {
            type: 'dropdown',
            name: 'is_required',
            placeholder: 'يجب ادخاله؟',
            dropdownOptions: useStore.getState().yesNoChoicesMandatory,
            required: true
          },
          { type: 'dropdown', name: 'subcategory_id', placeholder: 'التصنيف الفرعي', dropdownOptions: useStore.getState().subcategories, required: true },
          {
            type: 'dropdown',
            name: 'status_id',
            placeholder: 'الحالة',
            dropdownOptions: useStore.getState().statuses.filter((s) => s.id === 1 || s.id === 2),
            required: true
          },
          { type: 'dropdown', name: 'data_type', placeholder: 'نوع الحقل', dropdownOptions: useStore.getState().fieldTypes, required: true },
          {
            type: 'dropdown',
            name: 'allow_multiselect',
            placeholder: 'سماح بالاختيار المتعدد؟',
            dropdownOptions: useStore.getState().yesNoChoicesOptional,
            showDependency: { name: 'data_type', value: 'dropdown' },
            required: false
          },
          {
            type: 'chips',
            name: 'options',
            placeholder: 'الخيارات: اكتب الاختيار ثم اضغط enter',
            showDependency: { name: 'data_type', value: 'dropdown' },
            required: false
          }
        ]}
      />
      <Divider className='h-1rem surface-300' />
      <BasicTable
        tableTitle={'عرض حقول المنتجات الخاصة بالتصنيف'}
        loading={loading}
        singleCount={3}
        elementsName='productAttributes'
        haveArabicName={false}
        getElements={productAttributeObj.current.getAll}
        addElement={productAttributeObj.current.addSingle}
        editElement={productAttributeObj.current.editSingle}
        deleteElement={productAttributeObj.current.deleteSingle}
        columns={[
          { type: 'dropdown', field: 'product_id', header: 'المنتج', dropdownOptions: useStore.getState().products, sortable: true, filterType: 'number' },
          {
            type: 'dropdown',
            field: 'subcategory_attribute_id',
            header: 'اسم الحقل',
            dropdownOptions: useStore.getState().subcategoryAttributes,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dynamic',
            field: 'value',
            header: 'القيمة المعطاة للحقل',
            className: 'dir-ltr',
            referenceField: 'subcategory_attribute_id',
            referenceOptions: useStore.getState().subcategoryAttributes
          }
        ]}
        formFields={[
          { type: 'dropdown', name: 'product_id', placeholder: 'المنتج', dropdownOptions: useStore.getState().products, required: true },
          {
            type: 'dropdown',
            name: 'subcategory_attribute_id',
            placeholder: 'اسم الحقل',
            dropdownOptions: useStore.getState().subcategoryAttributes,
            required: true
          },
          {
            type: 'dynamic',
            name: 'value',
            placeholder: 'القيمة المعطاة للحقل',
            referenceField: 'subcategory_attribute_id',
            referenceOptions: useStore.getState().subcategoryAttributes,
            required: true
          }
        ]}
      />
    </main>
  );
}
