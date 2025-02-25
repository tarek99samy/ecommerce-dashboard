import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../services/ApiService';
import useStore from '../store/store';
import BasicTable from '../components/BasicTable';
import { Divider } from 'primereact/divider';

export default function Users() {
  const toast = useRef(null);
  const userObj = useRef(new ApiService('user'));
  const adpackageObj = useRef(new ApiService('adpackage'));
  const userAdPackageObj = useRef(new ApiService('useradpackage'));
  const userSuspensionObj = useRef(new ApiService('user-suspension'));
  const statusObj = useRef(new ApiService('status'));
  const countryObj = useRef(new ApiService('country'));
  const categoryObj = useRef(new ApiService('category'));
  const currencyObj = useRef(new ApiService('currency'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'المستخدمين';
    if (useStore.getState().statuses.length === 0) {
      statusObj.current.getAll('statuses').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().countries.length === 0) {
      countryObj.current.getAll('countries').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().categories.length === 0) {
      categoryObj.current.getAll('categories').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().currencies.length === 0) {
      currencyObj.current.getAll('currencies').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
  }, []);

  useEffect(() => {
    if (loading && useStore.getState().categories.length && useStore.getState().statuses.length && useStore.getState().countries.length) setLoading(false);
    // eslint-disable-next-line
  }, [useStore.getState().statuses, useStore.getState().countries, useStore.getState().categories, loading]);

  return (
    <main className='p-3 flex flex-column align-items-center justify-content-center gap-3'>
      <h1>لوحة التحكم بالمستخدمين</h1>
      <BasicTable
        tableTitle='عرض المستخدمين'
        loading={loading}
        elementsName='users'
        haveArabicName={false}
        getElements={userObj.current.getAll}
        addElement={userObj.current.addSingle}
        editElement={userObj.current.editSingle}
        deleteElement={userObj.current.deleteSingle}
        uploadOptions={{ key: 'icon', handler: userObj.current.uploadFile, multiple: false }}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          { type: 'text', field: 'name', header: 'الاسم', className: 'w-7rem', allowEdit: false, sortable: true, filterType: 'text' },
          {
            type: 'text',
            field: 'email',
            header: 'البريد الالكتروني',
            className: 'w-10rem dir-ltr',
            allowEdit: false,
            sortable: true,
            filterType: 'text'
          },
          { type: 'text', field: 'phone', header: 'الهاتف', className: 'w-7rem', allowEdit: false, sortable: true, filterType: 'text' },
          { type: 'text', field: 'country_code', header: 'كود البلد', className: 'w-6rem', allowEdit: false, sortable: true, filterType: 'text' },
          { type: 'text', field: 'password', header: 'كلمة المرور', className: 'w-10rem', allowEdit: false, sortable: true, filterType: 'text' },
          { type: 'date', field: 'birthdate', header: 'تاريخ الميلاد', className: 'w-10rem', allowEdit: false, sortable: true, filterType: 'date' },
          {
            type: 'dropdown',
            field: 'gender',
            header: 'النوع',
            className: 'w-1rem',
            dropdownOptions: useStore.getState().genders,
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'text', field: 'about', header: 'عن المستخدم', className: 'w-10rem', allowEdit: false, sortable: true, filterType: 'text' },
          {
            type: 'dropdown',
            field: 'status_id',
            header: 'الحالة',
            className: 'w-5rem',
            dropdownOptions: useStore.getState().statuses,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'country_id',
            header: 'الدولة',
            className: 'w-5rem',
            dropdownOptions: useStore.getState().countries,
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'image', field: 'icon', header: 'الصورة' },
          { type: 'text', field: 'fcm_token', header: 'كود الاشعارات', className: 'w-10rem' },
          {
            type: 'dropdown',
            field: 'lang',
            header: 'اللغة',
            className: 'w-1rem',
            dropdownOptions: useStore.getState().languages,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'role',
            header: 'الصلاحية',
            className: 'w-1rem',
            dropdownOptions: useStore.getState().roles,
            sortable: true,
            filterType: 'dropdown'
          }
        ]}
        formFields={[
          { type: 'text', name: 'name', placeholder: 'الاسم', required: false },
          { type: 'text', name: 'email', placeholder: 'البريد الالكتروني', required: true },
          { type: 'text', name: 'country_code', placeholder: 'كود البلد مثل 20 , 967 , ...', required: true },
          { type: 'text', name: 'phone', placeholder: 'رقم الهاتف بدون كود البلد', required: true },
          { type: 'text', name: 'password', placeholder: 'كلمة المرور (8 حروف على الأقل)', required: true },
          { type: 'date', name: 'birthdate', placeholder: 'تاريخ الميلاد', required: false },
          { type: 'dropdown', name: 'gender', placeholder: 'النوع', required: false, dropdownOptions: useStore.getState().genders },
          { type: 'text', name: 'about', placeholder: 'عن المستخدم', required: false },
          { type: 'dropdown', name: 'status_id', placeholder: 'الحالة', required: true, dropdownOptions: useStore.getState().statuses },
          { type: 'dropdown', name: 'country_id', placeholder: 'الدولة', required: true, dropdownOptions: useStore.getState().countries },
          { type: 'text', name: 'fcm_token', placeholder: 'كود الاشعارات', required: false },
          { type: 'dropdown', name: 'lang', placeholder: 'اللغة', required: true, dropdownOptions: useStore.getState().languages },
          { type: 'dropdown', name: 'role', placeholder: 'الصلاحية', required: true, dropdownOptions: useStore.getState().roles },
          { type: 'image', name: 'icon', placeholder: 'الصورة الشخصية', required: false }
        ]}
      />
      <Divider className='h-1rem surface-300' />
      <BasicTable
        tableTitle='عرض باقات الاعلانات'
        loading={loading}
        singleCount={6}
        elementsName='adpackages'
        getElements={adpackageObj.current.getAll}
        addElement={adpackageObj.current.addSingle}
        editElement={adpackageObj.current.editSingle}
        deleteElement={adpackageObj.current.deleteSingle}
        uploadOptions={{ key: 'icon', handler: adpackageObj.current.uploadFile, multiple: false }}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          { type: 'text', field: 'name_en', header: 'الاسم الانجليزي', className: 'w-8rem dir-ltr', sortable: true, filterType: 'text' },
          { type: 'text', field: 'name_ar', header: 'الاسم العربي', className: 'w-8rem', sortable: true, filterType: 'text' },
          { type: 'text', field: 'description_en', header: 'الوصف الانجليزي', className: 'w-15rem dir-ltr', sortable: true, filterType: 'text' },
          { type: 'text', field: 'description_ar', header: 'الوصف العربي', className: 'w-15rem', sortable: true, filterType: 'text' },
          { type: 'number', field: 'price', header: 'سعر الباقة', className: 'w-6rem', sortable: true, filterType: 'number' },
          {
            type: 'dropdown',
            field: 'currency_id',
            header: 'العملة',
            className: 'w-8rem',
            dropdownOptions: useStore.getState().currencies,
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'number', field: 'discount', header: 'نسبة الخصم', className: 'w-6rem', sortable: true, filterType: 'number' },
          { type: 'image', field: 'icon', header: 'الايقونة', className: 'w-6rem' },
          { type: 'color', field: 'title_color', header: 'لون العنوان', className: 'w-6rem' },
          {
            type: 'dropdown',
            field: 'status_id',
            header: 'الحالة',
            className: 'w-6rem',
            dropdownOptions: useStore.getState().statuses,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'country_id',
            header: 'الدولة',
            className: 'w-6rem',
            dropdownOptions: useStore.getState().countries,
            sortable: true,
            filterType: 'dropdown'
          }
        ]}
        formFields={[
          { type: 'text', name: 'name_en', placeholder: 'الاسم الانجليزي', required: true },
          { type: 'text', name: 'name_ar', placeholder: 'الاسم العربي', required: true },
          { type: 'text', name: 'description_en', placeholder: 'الوصف الانجليزي', required: false },
          { type: 'text', name: 'description_ar', placeholder: 'الوصف العربي', required: false },
          { type: 'number', name: 'price', placeholder: 'سعر الباقة', required: false },
          { type: 'dropdown', name: 'currency_id', placeholder: 'العملة', dropdownOptions: useStore.getState().currencies, required: true },
          { type: 'number', name: 'discount', placeholder: 'نسبة الخصم', required: false },
          { type: 'image', name: 'icon', placeholder: 'الايقونة', required: false },
          { type: 'color', name: 'title_color', placeholder: 'لون العنوان', required: false },
          { type: 'dropdown', name: 'status_id', placeholder: 'الحالة', dropdownOptions: useStore.getState().statuses, required: true },
          { type: 'dropdown', name: 'country_id', placeholder: 'الدولة', dropdownOptions: useStore.getState().countries, required: true }
        ]}
      />
      <Divider className='h-1rem surface-300' />
      <BasicTable
        tableTitle='عرض باقات اعلانات المستخدمين'
        loading={loading}
        singleCount={3}
        elementsName='userAdpackages'
        haveArabicName={false}
        getElements={userAdPackageObj.current.getAll}
        addElement={userAdPackageObj.current.addSingle}
        editElement={userAdPackageObj.current.editSingle}
        deleteElement={userAdPackageObj.current.deleteSingle}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          { type: 'dropdown', field: 'user_id', header: 'المستخدم', dropdownOptions: useStore.getState().users, sortable: true, filterType: 'dropdown' },
          {
            type: 'dropdown',
            field: 'ad_package_id',
            header: 'باقة الاعلانات',
            dropdownOptions: useStore.getState().adpackages,
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'dropdown', field: 'status_id', header: 'الحالة', dropdownOptions: useStore.getState().statuses, sortable: true, filterType: 'dropdown' }
        ]}
        formFields={[
          { type: 'dropdown', name: 'user_id', placeholder: 'المستخدم', dropdownOptions: useStore.getState().users, required: true },
          { type: 'dropdown', name: 'ad_package_id', placeholder: 'باقة الاعلانات', dropdownOptions: useStore.getState().adpackages, required: true },
          { type: 'dropdown', name: 'status_id', placeholder: 'الحالة', dropdownOptions: useStore.getState().statuses, required: true }
        ]}
      />
      <Divider className='h-1rem surface-300' />
      <BasicTable
        tableTitle='عرض حظر المستخدمين'
        loading={loading}
        singleCount={3}
        elementsName='suspensions'
        haveArabicName={false}
        getElements={userSuspensionObj.current.getAll}
        addElement={userSuspensionObj.current.addSingle}
        editElement={userSuspensionObj.current.editSingle}
        deleteElement={userSuspensionObj.current.deleteSingle}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          { type: 'dropdown', field: 'user_id', header: 'المستخدم', dropdownOptions: useStore.getState().users, sortable: true, filterType: 'dropdown' },
          { type: 'text', field: 'reason', header: 'سبب الحظر', sortable: true, filterType: 'text' },
          { type: 'date', field: 'end_date', header: 'تاريخ انتهاء الحظر', sortable: true, filterType: 'date' }
        ]}
        formFields={[
          { type: 'dropdown', name: 'user_id', placeholder: 'المستخدم', dropdownOptions: useStore.getState().users, required: true },
          { type: 'text', name: 'reason', placeholder: 'سبب الحظر', required: true },
          { type: 'date', name: 'end_date', placeholder: 'تاريخ انتهاء الحظر', required: true }
        ]}
      />
    </main>
  );
}
