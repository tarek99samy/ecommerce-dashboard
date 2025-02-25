import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../services/ApiService';
import useStore from '../store/store';
import BasicTable from '../components/BasicTable';
import { Divider } from 'primereact/divider';

export default function Categories() {
  const toast = useRef(null);
  const categoryObj = useRef(new ApiService('category'));
  const subcategoryObj = useRef(new ApiService('subcategory'));
  const thirdcategoryObj = useRef(new ApiService('thirdcategory'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'الاقسام و متعلقاتها';
    if (useStore.getState().categories.length === 0) {
      categoryObj.current.getAll('categories').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
  }, []);

  useEffect(() => {
    if (loading && useStore.getState().categories.length) setLoading(false);
    // eslint-disable-next-line
  }, [useStore.getState().categories, loading]);

  return (
    <main className='p-3 flex flex-column align-items-center justify-content-center gap-3'>
      <h1>لوحة التحكم بالاقسام و متعلقاتها</h1>
      <BasicTable
        tableTitle='عرض الاقسام'
        loading={loading}
        noDelete={true}
        singleCount={3}
        elementsName='categories'
        getElements={categoryObj.current.getAll}
        addElement={categoryObj.current.addSingle}
        editElement={categoryObj.current.editSingle}
        deleteElement={categoryObj.current.deleteSingle}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          { type: 'text', field: 'name_en', header: 'الاسم الانجليزي', sortable: true, filterType: 'text' },
          { type: 'text', field: 'name_ar', header: 'الاسم العربي', sortable: true, filterType: 'text' },
          { type: 'image', field: 'icon', header: 'الايقونة' }
        ]}
        formFields={[
          { type: 'text', name: 'name_en', placeholder: 'الاسم الانجليزي', required: true },
          { type: 'text', name: 'name_ar', placeholder: 'الاسم العربي', required: true },
          { type: 'image', name: 'icon', placeholder: 'الايقونة', required: false }
        ]}
      />
      <Divider className='h-1rem surface-300' />
      <BasicTable
        tableTitle='عرض الاقسام الفرعية'
        loading={loading}
        noDelete={true}
        singleCount={4}
        elementsName='subcategories'
        getElements={subcategoryObj.current.getAll}
        addElement={subcategoryObj.current.addSingle}
        editElement={subcategoryObj.current.editSingle}
        deleteElement={subcategoryObj.current.deleteSingle}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          { type: 'text', field: 'name_en', header: 'الاسم الانجليزي', sortable: true, filterType: 'text' },
          { type: 'text', field: 'name_ar', header: 'الاسم العربي', sortable: true, filterType: 'text' },
          {
            type: 'dropdown',
            field: 'category_id',
            header: 'القسم الرئيسي',
            dropdownOptions: useStore.getState().categories,
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'image', field: 'icon', header: 'الايقونة' }
        ]}
        formFields={[
          { type: 'text', name: 'name_en', placeholder: 'الاسم الانجليزي', required: true },
          { type: 'text', name: 'name_ar', placeholder: 'الاسم العربي', required: true },
          { type: 'dropdown', name: 'category_id', placeholder: 'القسم الرئيسي', dropdownOptions: useStore.getState().categories, required: true },
          { type: 'image', name: 'icon', placeholder: 'الايقونة', required: false }
        ]}
      />
      <Divider className='h-1rem surface-300' />
      <BasicTable
        tableTitle='عرض الاقسام الداخلية'
        loading={loading}
        noDelete={true}
        singleCount={4}
        elementsName='thirdcategories'
        getElements={thirdcategoryObj.current.getAll}
        addElement={thirdcategoryObj.current.addSingle}
        editElement={thirdcategoryObj.current.editSingle}
        deleteElement={thirdcategoryObj.current.deleteSingle}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          { type: 'text', field: 'name_en', header: 'الاسم الانجليزي', sortable: true, filterType: 'text' },
          { type: 'text', field: 'name_ar', header: 'الاسم العربي', sortable: true, filterType: 'text' },
          {
            type: 'dropdown',
            field: 'subcategory_id',
            header: 'القسم الفرعي',
            dropdownOptions: useStore.getState().subcategories,
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'image', field: 'icon', header: 'الايقونة' }
        ]}
        formFields={[
          { type: 'text', name: 'name_en', placeholder: 'الاسم الانجليزي', required: true },
          { type: 'text', name: 'name_ar', placeholder: 'الاسم العربي', required: true },
          { type: 'dropdown', name: 'subcategory_id', placeholder: 'القسم الفرعي', dropdownOptions: useStore.getState().subcategories, required: true },
          { type: 'image', name: 'icon', placeholder: 'الايقونة', required: false }
        ]}
      />
    </main>
  );
}
