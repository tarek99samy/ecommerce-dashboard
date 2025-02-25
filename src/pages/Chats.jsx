import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../services/ApiService';
import useStore from '../store/store';
import BasicTable from '../components/BasicTable';
import { Divider } from 'primereact/divider';

export default function Chats() {
  const toast = useRef(null);
  const chatObj = useRef(new ApiService('chat'));
  const messageObj = useRef(new ApiService('message'));
  const userObj = useRef(new ApiService('user'));
  const productObj = useRef(new ApiService('product'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'المحادثات والرسائل';
    if (useStore.getState().users.length === 0) {
      userObj.current.getAll('users').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
    if (useStore.getState().products.length === 0) {
      productObj.current.getAll('products').catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 3000 }));
    }
  }, []);

  useEffect(() => {
    if (loading && useStore.getState().users.length) setLoading(false);
    // eslint-disable-next-line
  }, [useStore.getState().users, loading]);

  return (
    <main className='p-3 flex flex-column align-items-center justify-content-center gap-3'>
      <h1>لوحة التحكم بالمحادثات والرسائل</h1>
      <BasicTable
        tableTitle='عرض المحادثات'
        loading={loading}
        noDelete={true}
        noEdit={true}
        singleCount={3}
        elementsName='chats'
        getElements={chatObj.current.getAll}
        addElement={chatObj.current.addSingle}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          {
            type: 'dropdown',
            field: 'sender_id',
            header: 'المرسل',
            dropdownOptions: useStore.getState().users,
            optionLabel: 'phone',
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'receiver_id',
            header: 'المستقبل',
            dropdownOptions: useStore.getState().users,
            optionLabel: 'phone',
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'product_id',
            header: 'المنتج',
            dropdownOptions: useStore.getState().products,
            sortable: true,
            filterType: 'dropdown'
          }
        ]}
      />
      <Divider className='h-1rem surface-300' />
      <BasicTable
        tableTitle='عرض الرسائل'
        noDelete={true}
        noEdit={true}
        loading={loading}
        singleCount={3}
        elementsName='messages'
        getElements={messageObj.current.getAll}
        addElement={messageObj.current.addSingle}
        uploadOptions={{ key: 'media', handler: messageObj.current.uploadFile, multiple: true }}
        columns={[
          { field: 'id', header: 'id', headerClassName: 'w-1rem', sortable: true, filterType: 'number' },
          {
            type: 'dropdown',
            field: 'sender_id',
            header: 'المرسل',
            dropdownOptions: useStore.getState().users,
            optionLabel: 'phone',
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'receiver_id',
            header: 'المستقبل',
            dropdownOptions: useStore.getState().users,
            sortable: true,
            filterType: 'dropdown'
          },
          {
            type: 'dropdown',
            field: 'chat_id',
            header: 'رقم المحادثة',
            dropdownOptions: useStore.getState().chats,
            optionLabel: 'id',
            sortable: true,
            filterType: 'dropdown'
          },
          { type: 'text', field: 'description', header: 'محتوي الرسالة', sortable: true, filterType: 'text' },
          { type: 'date', field: 'datetime', header: 'تاريخ الرسالة', sortable: true, filterType: 'date' },
          { type: 'media', field: 'media', header: 'المرفقات' }
        ]}
      />
    </main>
  );
}
