import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../services/ApiService';
import useStore from '../store/store';
import BasicTable from '../components/BasicTable';
import { Divider } from 'primereact/divider';

export default function Archive() {
  const toast = useRef(null);
  const archiveObj = useRef(new ApiService('archive'));
  const reportObj = useRef(new ApiService('report'));
  const userObj = useRef(new ApiService('user'));
  const articleObj = useRef(new ApiService('article'));
  const productObj = useRef(new ApiService('product'));
  const adObj = useRef(new ApiService('ad'));
  const commentObj = useRef(new ApiService('comment'));
  const messageObj = useRef(new ApiService('message'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'الأرشيف والإبلاغات';
    if (useStore.getState().users.length === 0) {
      userObj.current.getAll('users').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().articles.length === 0) {
      articleObj.current.getAll('articles').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().ads.length === 0 || useStore.getState().products.length === 0) {
      productObj.current.getAll('products').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
      adObj.current.getAll('ads').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().comments.length === 0) {
      commentObj.current.getAll('comments').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().messages.length === 0) {
      messageObj.current.getAll('messages').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
  }, []);

  useEffect(() => {
    if (loading && useStore.getState().users.length && useStore.getState().articles.length && useStore.getState().ads.length) {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [useStore.getState().users, useStore.getState().articles.length, useStore.getState().ads, loading]);

  return (
    <main className='p-3 flex flex-column align-items-center justify-content-center gap-3'>
      <h1>لوحة التحكم بالأرشيف والإبلاغات</h1>
      <h3>يمكن عمل ارشيف لإعلان باستخدام عنوان المنتج المربوط بالإعلان او منشور باستخدام عنوانه فقط</h3>
      <BasicTable
        tableTitle='عرض الأرشيف'
        loading={loading}
        singleCount={4}
        elementsName='archives'
        getElements={archiveObj.current.getAll}
        addElement={archiveObj.current.addSingle}
        editElement={archiveObj.current.editSingle}
        deleteElement={archiveObj.current.deleteSingle}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          {
            type: 'dropdown',
            field: 'entity_type',
            header: 'نوع العنصر المؤرشف',
            dropdownOptions: useStore.getState().archiveEntityTypes,
            optionLabel: 'name',
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dynamic-dropdown',
            field: 'entity_id',
            header: 'عنوان المنشور او (المنتج)الاعلان',
            dropdownOptions: {
              articles: useStore.getState().articles,
              ads: useStore
                .getState()
                .ads.map((ad) => ({ ...ad, name: useStore.getState().products.find((product) => product.id === ad.product_id)?.name }))
            },
            allowEdit: false,
            sortable: true
          },
          {
            type: 'dropdown',
            field: 'user_id',
            header: 'المستخدم المؤرشف',
            dropdownOptions: useStore.getState().users,
            optionLabel: 'phone',
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'text', field: 'reason', header: 'السبب', sortable: true, filterType: 'text' },
          { type: 'date', field: 'datetime', header: 'تاريخ الأرشقة', allowEdit: false, sortable: true, filterType: 'date' },
          { type: 'text', field: 'extra_data', header: 'بيانات اضافية', sortable: true, filterType: 'text' }
        ]}
        formFields={[
          {
            type: 'dropdown',
            name: 'entity_type',
            placeholder: 'نوع العنصر المؤرشف',
            dropdownOptions: useStore.getState().archiveEntityTypes,
            optionLabel: 'name',
            required: true
          },
          {
            type: 'dynamic-dropdown',
            name: 'entity_id',
            placeholder: 'عنوان المنشور او (المنتج)الاعلان',
            dropdownOptions: {
              articles: useStore.getState().articles,
              ads: useStore
                .getState()
                .ads.map((ad) => ({ ...ad, name: useStore.getState().products.find((product) => product.id === ad.product_id)?.name }))
            },
            required: true
          },
          {
            type: 'dropdown',
            name: 'user_id',
            placeholder: 'المستخدم المؤرشف',
            dropdownOptions: useStore.getState().users,
            optionLabel: 'phone',
            required: true
          },
          { type: 'text', name: 'reason', placeholder: 'السبب', required: false },
          { type: 'date', name: 'datetime', placeholder: 'تاريخ الأرشقة', required: true },
          { type: 'text', name: 'extra_data', placeholder: 'بيانات اضافية', required: false }
        ]}
      />
      <Divider className='h-1rem surface-300' />
      <h3>يمكن الاطلاع او حذف ابلاغ قادم من المستخدمين الي الادارة</h3>
      <BasicTable
        tableTitle='عرض الإبلاغات'
        loading={loading}
        singleCount={4}
        elementsName='reports'
        getElements={reportObj.current.getAll}
        addElement={reportObj.current.addSingle}
        editElement={reportObj.current.editSingle}
        deleteElement={reportObj.current.deleteSingle}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          {
            type: 'dropdown',
            field: 'entity_type',
            header: 'نوع العنصر المبلغ عنه',
            dropdownOptions: useStore.getState().reportEntityTypes,
            optionLabel: 'name',
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dynamic-dropdown',
            field: 'entity_id',
            header: 'محتوي التعليق او الرسالة',
            dropdownOptions: {
              comments: useStore.getState().comments,
              messages: useStore.getState().messages
            },
            optionLabel: 'description',
            allowEdit: false,
            sortable: true
          },
          {
            type: 'dropdown',
            field: 'user_id',
            header: 'المستخدم المبلغ',
            dropdownOptions: useStore.getState().users,
            optionLabel: 'phone',
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'text', field: 'reason', header: 'السبب', allowEdit: false, sortable: true, filterType: 'text' },
          { type: 'date', field: 'datetime', header: 'تاريخ الإبلاغ', allowEdit: false, sortable: true, filterType: 'date' },
          { type: 'text', field: 'extra_data', header: 'بيانات اضافية', allowEdit: false, sortable: true, filterType: 'text' }
        ]}
      />
    </main>
  );
}
