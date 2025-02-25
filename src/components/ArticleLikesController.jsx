import React, { useState, useRef } from 'react';
import ApiService from '../services/ApiService';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';

export default function ArticleLikesController({ articles, users }) {
  const toast = useRef(null);
  const likeObj = useRef(new ApiService('like'));
  const dislikeObj = useRef(new ApiService('dislike'));
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleToggleLike = async (e) => {
    const response = await likeObj.current.toggle({ article_id: selectedArticle, user_id: selectedUser });
    if (response.status === 200) {
      setSelectedArticle(null);
      setSelectedUser(null);
      toast.current.show({ severity: 'success', summary: 'عملية ناجحة', detail: 'تم الغاء الاعجاب للمنشور', life: 1000 });
      localStorage.removeItem('ecommerce-dashboard');
      window.location.reload();
    } else if (response.status === 201) {
      setSelectedArticle(null);
      setSelectedUser(null);
      toast.current.show({ severity: 'success', summary: 'عملية ناجحة', detail: 'تم عمل اعجاب للمنشور', life: 1000 });
      localStorage.removeItem('ecommerce-dashboard');
      window.location.reload();
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'عملية فاشلة',
        detail: response.data.message || 'حدث خطاء في عمل/الغاء اعجاب للمنشور',
        life: 1000
      });
    }
  };

  const handleToggleDislike = async (e) => {
    const response = await dislikeObj.current.toggle({ article_id: selectedArticle, user_id: selectedUser });
    if (response.status === 200) {
      setSelectedArticle(null);
      setSelectedUser(null);
      toast.current.show({ severity: 'success', summary: 'عملية ناجحة', detail: 'تم الغاء عدم الاعجاب للمنشور', life: 1000 });
      localStorage.removeItem('ecommerce-dashboard');
      window.location.reload();
    } else if (response.status === 201) {
      setSelectedArticle(null);
      setSelectedUser(null);
      toast.current.show({ severity: 'success', summary: 'عملية ناجحة', detail: 'تم عمل عدم الاعجاب للمنشور', life: 1000 });
      localStorage.removeItem('ecommerce-dashboard');
      window.location.reload();
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'عملية فاشلة',
        detail: response.data.message || 'حدث خطاء في عمل/الغاء عدم الاعجاب للمنشور',
        life: 1000
      });
    }
  };

  return (
    <div className='flex align-items-center gap-3 py-3'>
      <Toast ref={toast} />
      <Dropdown
        options={articles}
        value={selectedArticle}
        onChange={(e) => setSelectedArticle(e.value)}
        optionLabel='title_ar'
        optionValue='id'
        placeholder='اختر المنشور'
        className='mr-2'
      />
      <Dropdown
        options={users}
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.value)}
        optionLabel='phone'
        optionValue='id'
        placeholder='اختر المستخدم'
        className='mr-2'
      />
      <Button
        icon='pi pi-thumbs-up'
        className='p-button-rounded p-button-success mr-2'
        onClick={handleToggleLike}
        disabled={!selectedArticle || !selectedUser}
      />
      <Button
        icon='pi pi-thumbs-down'
        className='p-button-rounded p-button-danger'
        onClick={handleToggleDislike}
        disabled={!selectedArticle || !selectedUser}
      />
    </div>
  );
}
