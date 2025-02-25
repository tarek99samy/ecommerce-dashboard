import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../services/ApiService';
import useStore from '../store/store';
import BasicTable from '../components/BasicTable';
import { Divider } from 'primereact/divider';

export default function Articles() {
  const toast = useRef(null);
  const articleObj = useRef(new ApiService('article'));
  const commentObj = useRef(new ApiService('comment'));
  const userObj = useRef(new ApiService('user'));
  const categoryObj = useRef(new ApiService('category'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'المنشورات والتعليقات';
    if (useStore.getState().users.length === 0) {
      userObj.current.getAll('users').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().categories.length === 0) {
      categoryObj.current.getAll('categories').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
  }, []);

  useEffect(() => {
    if (loading && useStore.getState().users.length && useStore.getState().categories.length) setLoading(false);
    // eslint-disable-next-line
  }, [useStore.getState().users, useStore.getState().categories, loading]);

  return (
    <main className='p-3 flex flex-column align-items-center justify-content-center gap-3'>
      <h1>لوحة التحكم بالمنشورات والتعليقات</h1>
      <BasicTable
        tableTitle='عرض المنشورات'
        loading={loading}
        canArchive={true}
        singleCount={4}
        elementsName='articles'
        getElements={articleObj.current.getAll}
        addElement={articleObj.current.addSingle}
        editElement={articleObj.current.editSingle}
        deleteElement={articleObj.current.deleteSingle}
        archiveElement={articleObj.current.archiveSingle}
        uploadOptions={{ key: 'image', handler: articleObj.current.uploadFile, multiple: false }}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          { type: 'text', field: 'title_en', header: 'العنوان الانجليزي', sortable: true, filterType: 'text' },
          { type: 'text', field: 'title_ar', header: 'العنوان العربي', sortable: true, filterType: 'text' },
          { type: 'text', field: 'description_en', header: 'الوصف الانجليزي', sortable: true, filterType: 'text' },
          { type: 'text', field: 'description_ar', header: 'الوصف العربي', sortable: true, filterType: 'text' },
          { type: 'date', field: 'datetime', header: 'تاريخ النشر', sortable: true, filterType: 'date' },
          {
            type: 'dropdown',
            field: 'author_id',
            header: 'الناشر',
            dropdownOptions: useStore.getState().users,
            optionLabel: 'phone',
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
            field: 'status_id',
            header: 'الحالة',
            dropdownOptions: useStore.getState().statuses.filter((status) => status.id === 1 || status.id === 2),
            optionLabel: 'name',
            sortable: true,
            filterType: 'dropdown'
          },
          { field: 'num_likes', header: 'عدد مرات الاعجاب', sortable: true, filterType: 'number' },
          { field: 'num_dislikes', header: 'عدد مرات عدم الاعجاب', sortable: true, filterType: 'number' },
          { type: 'media', field: 'image', header: 'الصورة', className: 'w-1rem' }
        ]}
        formFields={[
          { type: 'text', name: 'title_en', placeholder: 'العنوان الانجليزي', required: true },
          { type: 'text', name: 'title_ar', placeholder: 'العنوان العربي', required: true },
          { type: 'text', name: 'description_en', placeholder: 'الوصف الانجليزي', required: true },
          { type: 'text', name: 'description_ar', placeholder: 'الوصف العربي', required: true },
          { type: 'date', name: 'datetime', placeholder: 'تاريخ النشر', required: true },
          { type: 'dropdown', name: 'category_id', placeholder: 'التصنيف الرئيسي', dropdownOptions: useStore.getState().categories, required: true },
          {
            type: 'dropdown',
            name: 'status_id',
            placeholder: 'الحالة',
            dropdownOptions: useStore.getState().statuses.filter((status) => status.id === 1 || status.id === 2),
            required: true
          },
          { type: 'dropdown', name: 'author_id', placeholder: 'الناشر', dropdownOptions: useStore.getState().users, optionLabel: 'phone', required: true },
          { type: 'image', name: 'image', placeholder: 'الصورة', required: false }
        ]}
      />
      <Divider className='h-1rem surface-300' />
      <BasicTable
        tableTitle='عرض التعليقات'
        loading={loading}
        noDelete={true}
        noEdit={true}
        singleCount={4}
        elementsName='comments'
        getElements={commentObj.current.getAll}
        addElement={commentObj.current.addSingle}
        editElement={commentObj.current.editSingle}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          {
            type: 'dropdown',
            field: 'article_id',
            header: 'المنشور',
            dropdownOptions: useStore.getState().articles,
            optionLabel: 'title_ar',
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'user_id',
            header: 'الناشر',
            dropdownOptions: useStore.getState().users,
            optionLabel: 'phone',
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'text', field: 'description', header: 'محتوي التعليق', sortable: true, filterType: 'text' },
          { type: 'date', field: 'datetime', header: 'تاريخ التعليق', sortable: true, filterType: 'date' }
        ]}
        formFields={[
          {
            type: 'dropdown',
            name: 'article_id',
            placeholder: 'المنشور',
            dropdownOptions: useStore.getState().articles,
            optionLabel: 'title_ar',
            required: true
          },
          { type: 'dropdown', name: 'user_id', placeholder: 'الناشر', dropdownOptions: useStore.getState().users, optionLabel: 'phone', required: true },
          { type: 'text', name: 'description', placeholder: 'محتوي التعليق', required: true },
          { type: 'date', name: 'datetime', placeholder: 'تاريخ التعليق', required: true }
        ]}
      />
    </main>
  );
}
