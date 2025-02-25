import React, { useEffect } from 'react';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const itemRenderer = (item) => (
    <Link to={item.url} className='flex align-items-center p-menuitem-link'>
      <i className={`${item.icon} p-menuitem-icon`} />
      <span className='p-menuitem-text text-base'>{item.label}</span>
    </Link>
  );
  const items = [
    {
      label: 'المستخدمين',
      icon: 'pi pi-user',
      url: '/users',
      template: itemRenderer
    },
    {
      label: 'المنتجات و الاعلانات',
      icon: 'pi pi-box',
      url: '/products',
      template: itemRenderer
    },
    {
      label: 'الاعلانات المدغوعة و الدفع',
      icon: 'pi pi-megaphone',
      url: '/paidads',
      template: itemRenderer
    },
    {
      label: 'المنشورات',
      icon: 'pi pi-thumbs-up',
      url: '/articles',
      template: itemRenderer
    },
    {
      label: 'المحادثات',
      icon: 'pi pi-comment',
      url: '/chats',
      template: itemRenderer
    },
    {
      label: 'الأقسام',
      icon: 'pi pi-sitemap',
      url: '/categories',
      template: itemRenderer
    },
    {
      label: 'الاماكن',
      icon: 'pi pi-map-marker',
      url: '/locations',
      template: itemRenderer
    },
    {
      label: 'الأرشيف والابلاغات',
      icon: 'pi pi-info-circle',
      url: '/archive',
      template: itemRenderer
    },
    {
      label: 'اعدادات عامة',
      icon: 'pi pi-database',
      url: '/general',
      template: itemRenderer
    }
  ];
  const start = (
    <Link to='/'>
      <img src='/logo.webp' alt='ecommerce logo' width={60} height={60} />{' '}
    </Link>
  );
  const end = (
    <Button
      label='تسجيل الخروج'
      onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }}
      severity='info'
    />
  );
  useEffect(() => {
    if (!localStorage.getItem('token')) window.location.href = '/login';
  }, []);

  return (
    <div className='card'>
      <Menubar model={items} start={start} end={end} className='bg-white shadow-4' />
    </div>
  );
}
