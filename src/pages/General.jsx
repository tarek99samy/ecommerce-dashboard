import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../services/ApiService';
import useStore from '../store/store';
import BasicTable from '../components/BasicTable';
import { Divider } from 'primereact/divider';
import SettingsForm from '../components/SettingsForm';

export default function General() {
  const toast = useRef(null);
  const statusObj = useRef(new ApiService('status'));
  const settingsObj = useRef(new ApiService('settings'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'العناصر العامة';
    if (useStore.getState().statuses.length === 0) {
      statusObj.current.getAll('statuses').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
  }, []);

  useEffect(() => {
    if (loading && useStore.getState().statuses.length) setLoading(false);
    // eslint-disable-next-line
  }, [useStore.getState().statuses, loading]);

  return (
    <main className='p-3 flex flex-column align-items-center justify-content-center gap-3'>
      <h1>لوحة التحكم بالعناصر العامة</h1>
      <SettingsForm />
      <Divider className='h-1rem surface-300' />
      <BasicTable
        tableTitle='عرض الحالات'
        loading={loading}
        noDelete={true}
        singleCount={2}
        elementsName='statuses'
        getElements={statusObj.current.getAll}
        addElement={statusObj.current.addSingle}
        editElement={statusObj.current.editSingle}
        deleteElement={statusObj.current.deleteSingle}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          { type: 'text', field: 'name_en', header: 'الاسم الانجليزي', sortable: true, filterType: 'text' },
          { type: 'text', field: 'name_ar', header: 'الاسم العربي', sortable: true, filterType: 'text' }
        ]}
        formFields={[
          { type: 'text', name: 'name_en', placeholder: 'الاسم الانجليزي', required: true },
          { type: 'text', name: 'name_ar', placeholder: 'الاسم العربي', required: true }
        ]}
      />
    </main>
  );
}
