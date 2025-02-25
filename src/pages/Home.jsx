import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../services/ApiService';
import useStore from '../store/store';
import BasicTable from '../components/BasicTable';
import { Divider } from 'primereact/divider';
import '../styles/pages/Home.scss';
import Statistics from '../components/Statistics';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function Home() {
  const toast = useRef(null);
  const userObj = useRef(new ApiService('user'));
  const adObj = useRef(new ApiService('ad'));
  const userAdPackageObj = useRef(new ApiService('useradpackage'));
  const userSuspensionObj = useRef(new ApiService('user-suspension'));
  const statusObj = useRef(new ApiService('status'));
  const countryObj = useRef(new ApiService('country'));
  const categoryObj = useRef(new ApiService('category'));
  const currencyObj = useRef(new ApiService('currency'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'لوحة تحكم تربح';
    if (useStore.getState().users.length === 0) {
      userObj.current.getAll('users').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
  }, []);

  useEffect(() => {
    if (loading && useStore.getState().users.length) {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [useStore.getState().users, loading]);

  return (
    <main className='p-3 flex flex-column align-items-center justify-content-center gap-3'>
      <h1>لوحة تحكم تربح</h1>
      <h2>احصائيات المستخدمين</h2>
      {loading ? (
        <ProgressSpinner />
      ) : (
        <div className='w-full flex justify-content-evenly'>
          <Statistics
            values={[
              useStore.getState().users.filter((user) => user.gender === 0).length,
              useStore.getState().users.filter((user) => user.gender === 1).length,
              useStore.getState().users.filter((user) => user.gender === null || user.gender === undefined).length
            ]}
            labels={['ذكور', 'إناث', 'غير محدد']}
          />
          <Statistics
            values={[
              useStore.getState().users.filter((user) => user.gender === 0).length,
              useStore.getState().users.filter((user) => user.gender === 1).length,
              useStore.getState().users.filter((user) => user.gender === null || user.gender === undefined).length
            ]}
            labels={['ذكور', 'إناث', 'غير محدد']}
          />
        </div>
      )}
      <Divider className='h-1rem surface-300' />
      <h2>احصائيات الاعلانات</h2>
      <div className='w-full flex justify-content-evenly'>
        <Statistics />
        <Statistics />
      </div>
    </main>
  );
}
