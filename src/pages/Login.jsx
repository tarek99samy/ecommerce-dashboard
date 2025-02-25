import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import '../styles/pages/Login.scss';
import axiosClient from '../utils/AxiosClient';

export default function Login() {
  const toast = useRef(null);
  const [data, setData] = useState({ email: '', password: '' });
  const [counter, setCounter] = useState(localStorage.getItem('counter') || 1);

  useEffect(() => {
    document.title = 'تسجيل الدخول في لوحة التحكم';
    return () => {
      clearTimeout();
      localStorage.setItem('counter', 1);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axiosClient
      .post('/auth/login/ByEmail', data)
      .then((res) => {
        if (res.data.user.role === 1) {
          const user = res.data.user;
          delete user.password;
          localStorage.setItem('counter', 1);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(user));
          window.location.href = '/';
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'خطأ',
            detail: 'ليس لديك صلاحية الدخول',
            life: 2000
          });
          const newCount = Math.max(+localStorage.getItem('counter') * 2, 2);
          setCounter(newCount);
          localStorage.setItem('counter', newCount);
          setTimeout(() => setCounter(1), newCount * 1000);
          setData({ email: '', password: '' });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.current.show({
          severity: 'error',
          summary: 'خطأ',
          detail: 'حدث خطأ اثناء تسجيل الدخول او بيانات غير صحيحة ',
          life: 2000
        });
        const newCount = Math.max(+localStorage.getItem('counter') * 2, 2);
        setCounter(newCount);
        localStorage.setItem('counter', newCount);
        setTimeout(() => setCounter(1), newCount * 1000);
        setData({ email: '', password: '' });
      });
  };

  return (
    <div className='w-full flex flex-column align-items-center justify-content-center p-8 gap-5'>
      <Toast ref={toast} />
      <img src='/logo.webp' alt='ecommerce logo' width={250} height={250} className='' />
      <form onSubmit={handleLogin} className='w-full flex flex-column align-items-center justify-content-center p-1 gap-5'>
        <InputText
          name='email'
          type='email'
          autoComplete='email'
          placeholder='البريد الالكتروني'
          value={data.email}
          onChange={handleInputChange}
          onInvalid={(e) => e.target.setCustomValidity('البريد الالكتروني غير صالح')}
          required
        />
        <InputText
          name='password'
          type='password'
          autocomplete='password'
          placeholder='كلمة المرور'
          minLength={8}
          value={data.password}
          onChange={handleInputChange}
          required
        />
        <Button label='تسجيل الدخول' type='submit' severity='info' disabled={data.password.length < 8} />
        {counter > 1 && <p className='text-red-500 text-center'>ثانية {counter} محاولة تسجيل الدخول فاشلة , برجاء الانتظار</p>}
      </form>
    </div>
  );
}
