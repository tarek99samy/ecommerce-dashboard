import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../services/ApiService';
import useStore from '../store/store';
import BasicTable from '../components/BasicTable';
import { Divider } from 'primereact/divider';

export default function Paidads() {
  const toast = useRef(null);
  const paidAdObj = useRef(new ApiService('paidad'));
  const paidAdSettingsObj = useRef(new ApiService('paidad-settings'));
  const statusObj = useRef(new ApiService('status'));
  const categoryObj = useRef(new ApiService('category'));
  const currencyObj = useRef(new ApiService('currency'));
  const countryObj = useRef(new ApiService('country'));
  const cityObj = useRef(new ApiService('city'));
  const areaObj = useRef(new ApiService('area'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'الاعلانات المدفوعة';
    if (useStore.getState().statuses.length === 0) {
      statusObj.current.getAll('statuses').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().categories.length === 0) {
      categoryObj.current.getAll('categories').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().currencies.length === 0) {
      currencyObj.current.getAll('currencies').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().countries.length === 0) {
      countryObj.current.getAll('countries').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().cities.length === 0) {
      cityObj.current.getAll('cities').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().areas.length === 0) {
      areaObj.current.getAll('areas').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
  }, []);

  useEffect(() => {
    if (loading && useStore.getState().countries.length && useStore.getState().cities.length && useStore.getState().areas.length) setLoading(false);
    // eslint-disable-next-line
  }, [useStore.getState().countries, useStore.getState().cities, useStore.getState().areas, loading]);

  return (
    <main className='p-3 flex flex-column align-items-center justify-content-center gap-3'>
      <h1>لوحة التحكم بالاعلانات المدفوعة</h1>
      <BasicTable
        tableTitle='عرض الاعلانات المدفوعة'
        loading={loading}
        singleCount={7}
        elementsName='paidAds'
        getElements={paidAdObj.current.getAll}
        addElement={paidAdObj.current.addSingle}
        editElement={paidAdObj.current.editSingle}
        deleteElement={paidAdObj.current.deleteSingle}
        uploadOptions={{ key: 'image', handler: paidAdObj.current.uploadFile, multiple: false }}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          { type: 'text', field: 'title_en', header: 'العنوان الانجليزي', sortable: true, filterType: 'text' },
          { type: 'text', field: 'title_ar', header: 'العنوان العربي', sortable: true, filterType: 'text' },
          { type: 'text', field: 'description_en', header: 'الوصف الانجليزي', sortable: true, filterType: 'text' },
          { type: 'text', field: 'description_ar', header: 'الوصف العربي', sortable: true, filterType: 'text' },
          { type: 'text', field: 'link', header: 'الرابط', sortable: true, filterType: 'text' },
          {
            type: 'dropdown',
            field: 'is_premium',
            header: 'يظهر في الصفحة الرئيسية؟',
            dropdownOptions: useStore.getState().yesNoChoicesMandatory,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'status_id',
            header: 'الحالة',
            dropdownOptions: useStore.getState().statuses.filter((status) => status.id === 1 || status.id === 2),
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'category_id',
            header: 'التصنيف الرئيسي',
            dropdownOptions: useStore.getState().categories,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'country_id',
            header: 'الدولة',
            dropdownOptions: useStore.getState().countries,
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'dropdown', field: 'city_id', header: 'المدينة', dropdownOptions: useStore.getState().cities, sortable: true, filterType: 'dropdown' },
          { type: 'dropdown', field: 'area_id', header: 'المنطقة', dropdownOptions: useStore.getState().areas, sortable: true, filterType: 'dropdown' },
          { type: 'number', field: 'remaining_days', header: 'عدد ايام ظهور الاعلان', sortable: true, filterType: 'number' },
          { type: 'media', field: 'image', header: 'الصورة', className: 'w-1rem' }
        ]}
        formFields={[
          { type: 'text', name: 'title_en', placeholder: 'العنوان الانجليزي', required: true },
          { type: 'text', name: 'title_ar', placeholder: 'العنوان العربي', required: true },
          { type: 'text', name: 'description_en', placeholder: 'الوصف الانجليزي', required: false },
          { type: 'text', name: 'description_ar', placeholder: 'الوصف العربي', required: false },
          { type: 'image', name: 'image', placeholder: 'الصورة', required: true },
          { type: 'text', name: 'link', placeholder: 'الرابط', required: false },
          {
            type: 'dropdown',
            name: 'is_premium',
            placeholder: 'يظهر في الصفحة الرئيسية؟',
            dropdownOptions: useStore.getState().yesNoChoicesMandatory,
            required: true
          },
          {
            type: 'dropdown',
            name: 'status_id',
            placeholder: 'الحالة',
            dropdownOptions: useStore.getState().statuses.filter((status) => status.id === 1 || status.id === 2),
            required: true
          },
          { type: 'dropdown', name: 'category_id', placeholder: 'التصنيف الرئيسي', dropdownOptions: useStore.getState().categories, required: false },
          { type: 'dropdown', name: 'country_id', placeholder: 'الدولة', dropdownOptions: useStore.getState().countries, required: true },
          { type: 'dropdown', name: 'city_id', placeholder: 'المدينة', dropdownOptions: useStore.getState().cities, required: false },
          { type: 'dropdown', name: 'area_id', placeholder: 'المنطقة', dropdownOptions: useStore.getState().areas, required: false },
          { type: 'number', name: 'remaining_days', placeholder: 'عدد ايام ظهور الاعلان', required: true }
        ]}
      />
      <Divider className='h-1rem surface-300' />
      <BasicTable
        tableTitle='عرض اعدادات الاعلانات المدفوعة'
        loading={loading}
        singleCount={4}
        elementsName='paidAdSettings'
        getElements={paidAdSettingsObj.current.getAll}
        addElement={paidAdSettingsObj.current.addSingle}
        editElement={paidAdSettingsObj.current.editSingle}
        deleteElement={paidAdSettingsObj.current.deleteSingle}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          { type: 'text', field: 'name_en', header: 'اسم الاعداد الانجليزي', sortable: true, filterType: 'text' },
          { type: 'text', field: 'name_ar', header: 'اسم الاعداد العربي', sortable: true, filterType: 'text' },
          { type: 'number', field: 'price', header: 'سعر الاعداد', sortable: true, filterType: 'number' },
          {
            type: 'dropdown',
            field: 'type',
            header: 'نوع الاعداد',
            dropdownOptions: useStore.getState().paidAdSettingTypes,
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'text', field: 'value', header: 'قيمة الاعداد', sortable: true, filterType: 'text' },
          {
            type: 'dropdown',
            field: 'currency_id',
            header: 'العملة',
            dropdownOptions: useStore.getState().currencies,
            sortable: true,
            filterType: 'dropdown'
          }
        ]}
        formFields={[
          { type: 'text', name: 'name_en', placeholder: 'اسم الاعداد الانجليزي', required: true },
          { type: 'text', name: 'name_ar', placeholder: 'اسم الاعداد العربي', required: true },
          { type: 'number', name: 'price', placeholder: 'سعر الاعداد', required: true },
          { type: 'dropdown', name: 'type', placeholder: 'نوع الاعداد', dropdownOptions: useStore.getState().paidAdSettingTypes, required: true },
          { type: 'text', name: 'value', placeholder: 'قيمة الاعداد', required: false },
          { type: 'dropdown', name: 'currency_id', placeholder: 'العملة', dropdownOptions: useStore.getState().currencies, required: true }
        ]}
      />
    </main>
  );
}
