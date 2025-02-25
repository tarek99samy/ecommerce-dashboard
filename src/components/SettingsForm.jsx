import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useForm, Controller } from 'react-hook-form';
import { InputNumber } from 'primereact/inputnumber';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

export default function SettingsForm() {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      age: null,
      birthDate: null,
      country: '',
      bio: '',
      subscribe: false,
      gender: '',
      favoriteColor: '#000000',
      skillLevel: 0
    }
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='max-w-2xl mx-auto p-6 space-y-6'>
      <h2 className='text-2xl font-bold mb-6'>Complex Form Example</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Text Inputs */}
        <div className='space-y-2'>
          <label htmlFor='firstName' className='block text-sm font-medium'>
            First Name
          </label>
          <Controller
            name='firstName'
            control={control}
            rules={{ required: 'First name is required' }}
            render={({ field }) => <InputText id={field.name} {...field} className='w-full' />}
          />
          {errors.firstName && <small className='text-red-500'>{errors.firstName.message}</small>}
        </div>

        <div className='space-y-2'>
          <label htmlFor='lastName' className='block text-sm font-medium'>
            Last Name
          </label>
          <Controller
            name='lastName'
            control={control}
            rules={{ required: 'Last name is required' }}
            render={({ field }) => <InputText id={field.name} {...field} className='w-full' />}
          />
          {errors.lastName && <small className='text-red-500'>{errors.lastName.message}</small>}
        </div>

        {/* Email Input */}
        <div className='space-y-2'>
          <label htmlFor='email' className='block text-sm font-medium'>
            Email
          </label>
          <Controller
            name='email'
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            }}
            render={({ field }) => <InputText id={field.name} {...field} type='email' className='w-full' />}
          />
          {errors.email && <small className='text-red-500'>{errors.email.message}</small>}
        </div>

        {/* Password Input */}
        <div className='space-y-2'>
          <label htmlFor='password' className='block text-sm font-medium'>
            Password
          </label>
          <Controller
            name='password'
            control={control}
            rules={{ required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } }}
            render={({ field }) => <Password id={field.name} {...field} toggleMask className='w-full' />}
          />
          {errors.password && <small className='text-red-500'>{errors.password.message}</small>}
        </div>

        {/* Number Input */}
        <div className='space-y-2'>
          <label htmlFor='age' className='block text-sm font-medium'>
            Age
          </label>
          <Controller
            name='age'
            control={control}
            rules={{ required: 'Age is required', min: { value: 18, message: 'Must be at least 18' } }}
            render={({ field }) => <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className='w-full' />}
          />
          {errors.age && <small className='text-red-500'>{errors.age.message}</small>}
        </div>

        {/* Dropdown */}
        {/* <div className='space-y-2'>
          <label htmlFor='country' className='block text-sm font-medium'>
            Country
          </label>
          <Controller
            name='country'
            control={control}
            rules={{ required: 'Country is required' }}
            render={({ field }) => (
              <Dropdown id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={countries} className='w-full' />
            )}
          />
          {errors.country && <small className='text-red-500'>{errors.country.message}</small>}
        </div> */}
      </div>

      {/* Textarea */}
      <div className='space-y-2'>
        <label htmlFor='bio' className='block text-sm font-medium'>
          Bio
        </label>
        <Controller
          name='bio'
          control={control}
          rules={{ required: 'Bio is required' }}
          render={({ field }) => <InputTextarea id={field.name} {...field} rows={4} className='w-full' />}
        />
        {errors.bio && <small className='text-red-500'>{errors.bio.message}</small>}
      </div>

      {/* Submit Button */}
      <Button type='submit' label='Submit' className='w-full' />
    </form>
  );
}
