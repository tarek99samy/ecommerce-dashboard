import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../services/ApiService';
import useStore from '../store/store';
import BasicTable from '../components/BasicTable';
import { Divider } from 'primereact/divider';

export default function Locations() {
  const toast = useRef(null);
  const countryObj = useRef(new ApiService('country'));
  const cityObj = useRef(new ApiService('city'));
  const areaObj = useRef(new ApiService('area'));
  const currencyObj = useRef(new ApiService('currency'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'الدول والاماكن';
    if (useStore.getState().countries.length === 0) {
      countryObj.current.getAll('countries').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
  }, []);

  useEffect(() => {
    if (loading && useStore.getState().countries.length) setLoading(false);
    // eslint-disable-next-line
  }, [useStore.getState().countries, loading]);

  return (
    <main className='p-3 flex flex-column align-items-center justify-content-center gap-3'>
      <h1>لوحة التحكم بالدول والاماكن</h1>
      <BasicTable
        tableTitle='عرض الدول'
        loading={loading}
        noDelete={true}
        singleCount={2}
        elementsName='countries'
        getElements={countryObj.current.getAll}
        addElement={countryObj.current.addSingle}
        editElement={countryObj.current.editSingle}
        deleteElement={countryObj.current.deleteSingle}
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
      <Divider className='h-1rem surface-300' />
      <BasicTable
        tableTitle='عرض المناطق'
        loading={loading}
        noDelete={true}
        singleCount={3}
        elementsName='cities'
        getElements={cityObj.current.getAll}
        addElement={cityObj.current.addSingle}
        editElement={cityObj.current.editSingle}
        deleteElement={cityObj.current.deleteSingle}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          { type: 'text', field: 'name_en', header: 'الاسم الانجليزي', sortable: true, filterType: 'text' },
          { type: 'text', field: 'name_ar', header: 'الاسم العربي', sortable: true, filterType: 'text' },
          {
            type: 'dropdown',
            field: 'country_id',
            header: 'الدولة',
            dropdownOptions: useStore.getState().countries,
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          }
        ]}
        formFields={[
          { type: 'text', name: 'name_en', placeholder: 'الاسم الانجليزي', required: true },
          { type: 'text', name: 'name_ar', placeholder: 'الاسم العربي', required: true },
          { type: 'dropdown', name: 'country_id', placeholder: 'الدولة', dropdownOptions: useStore.getState().countries, required: true }
        ]}
      />
      <Divider className='h-1rem surface-300' />
      <BasicTable
        tableTitle='عرض المدن'
        loading={loading}
        noDelete={true}
        singleCount={3}
        elementsName='areas'
        getElements={areaObj.current.getAll}
        addElement={areaObj.current.addSingle}
        editElement={areaObj.current.editSingle}
        deleteElement={areaObj.current.deleteSingle}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          { type: 'text', field: 'name_en', header: 'الاسم الانجليزي', sortable: true, filterType: 'text' },
          { type: 'text', field: 'name_ar', header: 'الاسم العربي', sortable: true, filterType: 'text' },
          {
            type: 'dropdown',
            field: 'city_id',
            header: 'المنطقة',
            dropdownOptions: useStore.getState().cities,
            allowEdit: false,
            sortable: true,
            filterType: 'dropdown'
          }
        ]}
        formFields={[
          { type: 'text', name: 'name_en', placeholder: 'الاسم الانجليزي', required: true },
          { type: 'text', name: 'name_ar', placeholder: 'الاسم العربي', required: true },
          { type: 'dropdown', name: 'city_id', placeholder: 'المنطقة', dropdownOptions: useStore.getState().cities, required: true }
        ]}
      />
      <Divider className='h-1rem surface-300' />
      <BasicTable
        tableTitle='عرض العملات'
        loading={loading}
        noDelete={true}
        singleCount={2}
        elementsName='currencies'
        getElements={currencyObj.current.getAll}
        addElement={currencyObj.current.addSingle}
        editElement={currencyObj.current.editSingle}
        deleteElement={currencyObj.current.deleteSingle}
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
