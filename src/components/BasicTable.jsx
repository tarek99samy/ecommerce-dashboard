import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { FilterMatchMode, FilterService } from 'primereact/api';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { ColorPicker } from 'primereact/colorpicker';
import { Chips } from 'primereact/chips';
import { MultiSelect } from 'primereact/multiselect';
import MediaModal from './MediaModal';
import { InputNumber } from 'primereact/inputnumber';

const MemoizedInputText = React.memo(InputText);

export default function BasicTable({
  tableTitle,
  loading,
  noDelete = false,
  noEdit = false,
  canArchive = false,
  elementsName,
  haveArabicName = true,
  getElements,
  addElement,
  editElement,
  deleteElement,
  archiveElement,
  uploadOptions,
  columns,
  formFields,
  singleCount = 7
}) {
  const toast = useRef(null);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState({});
  const [showAddElementModal, setShowAddElementModal] = useState(false);
  const [newElement, setNewElement] = useState({});
  const [isMediaModalEditing, setIsMediaModalEditing] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaModalData, setMediaModalData] = useState({ type: '', data: [] });
  const [filters, setFilters] = useState({});
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    getElements(elementsName, haveArabicName)
      .then((res) => {
        const _elements = res.map((element) => {
          Object.keys(element).forEach((key) => {
            if (key.toString().includes('date') && element[key]) {
              element[key] = new Date(element[key]);
            }
          });
          return element;
        });
        setElements(_elements);
      })
      .catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 1000 }));
    initFilters();
    clearSort();
    // eslint-disable-next-line
  }, []);

  const getFilterMatchMode = (type) => {
    switch (type) {
      case 'dropdown':
        return FilterMatchMode.EQUALS;
      case 'date':
        return FilterMatchMode.DATE_IS;
      case 'number':
        return FilterMatchMode.EQUALS;
      default:
        return FilterMatchMode.CONTAINS;
    }
  };

  const clearSort = () => {
    setSortField(null);
    setSortOrder(null);
  };

  const initFilters = () => {
    const _filters = {};
    columns.forEach((column) => {
      if (column.filterType) {
        _filters[column.field] = { value: null, matchMode: getFilterMatchMode(column.filterType) };
      }
    });
    setFilters({ ..._filters });
  };

  const onRowEditComplete = async (e) => {
    let _elements = [...elements];
    let { newData, index } = e;
    Object.keys(newData).forEach((key) => {
      if (key !== 'id' && newData[key] === _elements[index][key]) delete newData[key];
    });
    if (!Object.keys(newData).length) return;
    if (uploadOptions && newData[uploadOptions.key]) {
      const response = await uploadOptions.handler(newData.id, uploadOptions.key, newData[uploadOptions.key]);
      if (response.status === 200) {
        toast.current.show({ severity: 'success', summary: 'عملية ناجحة', detail: 'تم تعديل الملفات بنجاح', life: 1000 });
      } else {
        toast.current.show({ severity: 'error', summary: 'عملية فاشلة', detail: response.data.message || 'حدث خطاء في تعديل ملفات العنصر', life: 1000 });
      }
      delete newData[uploadOptions.key];
    }
    if (Object.keys(newData).length === 1) {
      localStorage.removeItem('ecommerce-dashboard');
      setTimeout(() => window.location.reload(), 1000);
      return;
    }
    _elements[index] = { ..._elements[index], ...newData };
    const newDataId = newData.id;
    delete newData.id;
    const response = await editElement(newDataId, newData);
    if (response.status === 200) {
      toast.current.show({ severity: 'success', summary: 'عملية ناجحة', detail: 'تم تعديل بيانات العنصر بنجاح', life: 1000 });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast.current.show({ severity: 'error', summary: 'عملية فاشلة', detail: response.data.message || 'حدث خطاء في تعديل بيانات العنصر', life: 1000 });
    }
  };

  const textEditor = (options) => {
    return <InputText type='text' className='w-full' value={options.value || ''} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  const numberEditor = (options) => {
    return <InputText type='number' className='w-full' value={options.value || ''} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  const formatDate = (date) => {
    let tmp = date
      .toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      .split('/');
    return `${tmp[2]}-${tmp[0]}-${tmp[1]}`;
  };

  const formatChips = (data) => {
    return Array.isArray(data) ? <Chips value={data} disabled /> : <Chips value={[data]} disabled />;
  };

  const showMedia = (type, data) => {
    return (
      <Button
        type='button'
        label='عرض'
        className='dir-ltr'
        icon='pi pi-external-link'
        onClick={() => {
          setShowMediaModal(true);
          setMediaModalData({ type, data: data.split(',') });
        }}
        size='small'
        severity='help'
      />
    );
  };

  const datetimeEditor = (options) => {
    return <Calendar value={new Date(options.value || '')} onChange={(e) => options.editorCallback(formatDate(e.value))} dateFormat='yy-mm-dd' />;
  };

  const dropdownEditor = (options, data, optionLabel = 'name') => {
    return <Dropdown optionLabel={optionLabel} optionValue='id' options={data} value={options.value} onChange={(e) => options.editorCallback(e.value)} />;
  };

  const chipsEditor = (options, value) => {
    return <Chips value={value} onChange={(e) => options.editorCallback(e.value)} />;
  };

  const multiselectEditor = (options, value, allOptions) => {
    if (!Array.isArray(value)) value = [value];
    allOptions = allOptions.map((option) => ({ label: option, value: option }));
    return <MultiSelect display='chip' showSelectAll={false} value={value} options={allOptions} onChange={(e) => options.editorCallback(e.value)} />;
  };

  const imageEditor = (options) => {
    return (
      <input
        type='file'
        accept='image/*,video/*'
        multiple={uploadOptions?.multiple}
        onChange={(e) => options.editorCallback(e.target.files)}
        className='w-12rem'
      />
    );
  };

  const mediaEditor = (type, data, id) => {
    return (
      <Button
        type='button'
        label='تعديل'
        className='dir-ltr'
        icon='pi pi-pencil'
        onClick={() => {
          setShowMediaModal(true);
          setIsMediaModalEditing(true);
          setMediaModalData({ type, data: data?.split(','), entityId: id });
        }}
        size='small'
        severity='help'
      />
    );
  };

  const colorEditor = (options) => {
    return <ColorPicker format='hex' value={options.value} onChange={(e) => options.editorCallback(`#${e.value}`)} />;
  };

  const handleAddElement = async (e) => {
    e.preventDefault();
    let newElementFiles;
    if (uploadOptions) {
      newElementFiles = newElement[uploadOptions.key];
      delete newElement[uploadOptions.key];
    }
    const response = await addElement(newElement);
    if (response.status === 201) {
      if (uploadOptions && newElementFiles) {
        const filesResponse = await uploadOptions.handler(response.data.id, uploadOptions.key, newElementFiles);
        if (filesResponse.status === 200) {
          toast.current.show({ severity: 'success', summary: 'عملية ناجحة', detail: 'تم إضافة العنصر و تحميل الملفات بنجاح', life: 1000 });
          await getElements(elementsName, haveArabicName)
            .then((res) => setElements(res))
            .catch(() => toast.current.show({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ', life: 1000 }));
          setShowAddElementModal(false);
          // localStorage.removeItem('ecommerce-dashboard');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.current.show({ severity: 'error', summary: 'عملية فاشلة', detail: filesResponse.data.message || 'حدث خطاء في تحميل الملفات', life: 1000 });
        }
      } else {
        toast.current.show({ severity: 'success', summary: 'عملية ناجحة', detail: 'تم إضافة العنصر بنجاح', life: 1000 });
        setShowAddElementModal(false);
        // localStorage.removeItem('ecommerce-dashboard');
        setTimeout(() => window.location.reload(), 1000);
      }
    } else {
      toast.current.show({ severity: 'error', summary: 'عملية فاشلة', detail: response.data.message || 'حدث خطاء في إضافة العنصر', life: 1000 });
    }
  };

  const handleDeleteElement = async () => {
    const response = await deleteElement(selectedElement.id);
    if (response.status === 200) {
      toast.current.show({ severity: 'success', summary: 'عملية ناجحة', detail: 'تم حذف العنصر بنجاح', life: 1000 });
      setElements(elements.filter((element) => element.id !== selectedElement.id));
      handleCloseDeleteElementConfirm();
      // localStorage.removeItem('ecommerce-dashboard');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast.current.show({ severity: 'error', summary: 'عملية فاشلة', detail: response.data.message || 'حدث خطاء في حذف العنصر', life: 1000 });
    }
  };

  const handleCloseDeleteElementConfirm = () => {
    setSelectedElement({});
  };

  const showDeleteElementConfirm = () => {
    confirmDialog({
      header: 'تأكيد',
      message: 'هل تريد حذف هذا العنصر؟',
      accept: handleDeleteElement,
      reject: handleCloseDeleteElementConfirm,
      acceptLabel: 'نعم',
      acceptClassName: 'p-button-danger',
      rejectLabel: 'لا',
      draggable: false,
      resizable: false,
      tagKey: tableTitle
    });
  };

  const handleArchiveElement = async () => {
    const response = await archiveElement(selectedElement);
    if (response.status === 200) {
      toast.current.show({ severity: 'success', summary: 'عملية ناجحة', detail: 'تم أرشفة العنصر بنجاح', life: 1000 });
      setElements(elements.filter((element) => element.id !== selectedElement.id));
      handleCloseArchiveElementConfirm();
      // localStorage.removeItem('ecommerce-dashboard');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast.current.show({ severity: 'error', summary: 'عملية فاشلة', detail: response.data.message || 'حدث خطاء في أرشفة العنصر', life: 1000 });
    }
  };

  const handleCloseArchiveElementConfirm = () => {
    setSelectedElement({});
  };

  const showArchiveElementConfirm = () => {
    confirmDialog({
      header: 'تأكيد',
      message: 'هل تريد أرشفة هذا العنصر؟',
      accept: handleArchiveElement,
      reject: handleCloseArchiveElementConfirm,
      acceptLabel: 'نعم',
      acceptClassName: 'p-button-danger',
      rejectLabel: 'لا',
      draggable: false,
      resizable: false,
      tagKey: tableTitle
    });
  };

  const handleAddElementInputChange = (e) => {
    const { name, value } = e.target;
    setNewElement((prev) => ({ ...prev, [name]: value || e.value }));
  };

  const handleAddElementFilesChange = (e) => {
    const { name, files } = e.target;
    setNewElement((prev) => ({ ...prev, [name]: files }));
  };

  const tableHeader = (
    <div className='w-full flex justify-content-between align-items-center'>
      <div className='flex gap-3 mx-2 align-items-center w-max'>
        <span>اجمالي العناصر: {elements.length}</span>
        {formFields && <Button title='إضافة' icon='pi pi-plus' severity='success' onClick={() => setShowAddElementModal(true)} size='small' rounded />}
        {noDelete ? null : (
          <Button
            title='حذف'
            icon='pi pi-trash'
            severity='danger'
            onClick={showDeleteElementConfirm}
            disabled={!selectedElement?.id}
            size='small'
            rounded
          />
        )}
        {canArchive && (
          <Button
            title='أرشفة'
            icon='pi pi-external-link'
            label='ارشفة'
            className='dir-ltr'
            severity='warning'
            onClick={showArchiveElementConfirm}
            disabled={!selectedElement?.id}
            size='small'
            rounded
          />
        )}
      </div>
      <div className='flex gap-2'>
        <Button type='button' className='dir-ltr' icon='pi pi-sort-alt-slash' label='إلفاء الترتيب' outlined onClick={() => clearSort()} />
        <Button type='button' className='dir-ltr' icon='pi pi-filter-slash' label='إلفاء التصفية' outlined onClick={() => initFilters()} />
      </div>
    </div>
  );

  const customSort = (e) => {
    setSortField(e.sortField);
    setSortOrder(e.sortOrder);
  };

  const showColumnBody = (column, rowData) => {
    if (column.type === 'dynamic') {
      let referenceValue = column.referenceOptions?.find((option) => option.id === rowData[column.referenceField]).data_type;
      switch (referenceValue) {
        case 'date':
          return rowData[column.field] ? formatDate(new Date(rowData[column.field])) : '';
        case 'dropdown':
          return formatChips(rowData[column.field]);
        default:
          return rowData[column.field];
      }
    } else {
      switch (column.type) {
        case 'media':
          return rowData[column.field] && showMedia(column.field, rowData[column.field]);
        case 'chips':
          return rowData[column.field] && formatChips(rowData[column.field]);
        case 'color':
          return rowData[column.field] && <ColorPicker value={rowData[column.field]} disabled />;
        case 'image':
          return <Avatar image={`${process.env.REACT_APP_BASE_IMAGE_URL}${rowData[column.field]}`} size='large' shape='circle' />;
        case 'date':
          return rowData[column.field] ? formatDate(new Date(rowData[column.field])) : '';
        case 'dropdown':
          const option = column.dropdownOptions?.find((option) => option.id === rowData[column.field]);
          return option && (option.name || option[column?.optionLabel]);
        case 'dynamic-dropdown':
          let dynamicOption;
          if (rowData['entity_type'] === 'article') {
            dynamicOption = column.dropdownOptions.articles?.find((option) => option.id === rowData[column.field]);
          } else if (rowData['entity_type'] === 'ad') {
            dynamicOption = column.dropdownOptions.ads?.find((option) => option.id === rowData[column.field]);
          } else if (rowData['entity_type'] === 'comment') {
            dynamicOption = column.dropdownOptions.comments?.find((option) => option.id === rowData[column.field]);
          } else if (rowData['entity_type'] === 'message') {
            dynamicOption = column.dropdownOptions.messages?.find((option) => option.id === rowData[column.field]);
          }
          return dynamicOption && (dynamicOption.name || dynamicOption[column?.optionLabel]);
        default:
          return rowData[column.field];
      }
    }
  };

  const showColumnEditor = (column, options) => {
    if (column.allowEdit === false) return null;
    if (column.type === 'dynamic') {
      let referenceValue = column.referenceOptions?.find((option) => option.id === options.rowData[column.referenceField]).data_type;
      switch (referenceValue) {
        case 'date':
          return datetimeEditor(options);
        case 'dropdown':
          const tempValue = column.referenceOptions?.find((option) => option.id === options.rowData[column.referenceField]);
          let allOptions = tempValue.options;
          if (tempValue.allow_multiselect) {
            return multiselectEditor(options, options.rowData[column.field], allOptions);
          } else {
            allOptions = allOptions.map((option) => ({ id: option, name: option }));
            return dropdownEditor(options, allOptions);
          }
        case 'number':
          return numberEditor(options);
        case 'text':
          return textEditor(options);
        default:
          return null;
      }
    } else {
      switch (column.type) {
        case 'chips':
          return chipsEditor(options, options.rowData[column.field]);
        case 'color':
          return colorEditor(options);
        case 'media':
          return mediaEditor(column.field, options.rowData[column.field], options.rowData.id);
        case 'image':
          return imageEditor(options);
        case 'date':
          return datetimeEditor(options);
        case 'dropdown':
          if (!Object.keys(column).includes('allowEdit') || column.allowEdit === true) {
            return dropdownEditor(options, column.dropdownOptions, column?.optionLabel);
          } else {
            return null;
          }
        case 'dynamic-dropdown':
          if (!Object.keys(column).includes('allowEdit') || column.allowEdit === true) {
            if (options.rowData['entity_type'] === 'article') {
              return dropdownEditor(options, column.dropdownOptions.articles, column?.optionLabel);
            } else if (options.rowData['entity_type'] === 'ad') {
              return dropdownEditor(options, column.dropdownOptions.ads, column?.optionLabel);
            } else if (options.rowData['entity_type'] === 'comment') {
              return dropdownEditor(options, column.dropdownOptions.comments, column?.optionLabel);
            } else if (options.rowData['entity_type'] === 'message') {
              return dropdownEditor(options, column.dropdownOptions.messages, column?.optionLabel);
            }
            return null;
          } else {
            return null;
          }
        case 'number':
          return numberEditor(options);
        case 'text':
          return textEditor(options);
        default:
          return null;
      }
    }
  };

  const showFormField = (field) => {
    switch (field.type) {
      case 'date':
        return (
          <Calendar
            name={field.name}
            placeholder={field.placeholder}
            dateFormat='yy-mm-dd'
            className='w-full'
            value={new Date(newElement[field.name] || new Date())}
            onChange={(e) => setNewElement({ ...newElement, [field.name]: formatDate(new Date(e.value)) })}
            onInvalid={(e) => e.target.setCustomValidity('هذا الحقل مطلوب')}
            required={field.required}
          />
        );
      case 'dropdown':
        if (field?.showDependency && newElement[field?.showDependency.name] !== field?.showDependency.value) return null;
        return (
          <Dropdown
            optionLabel={field.optionLabel || 'name'}
            optionValue='id'
            options={field.dropdownOptions}
            className='w-full'
            name={field.name}
            placeholder={field.placeholder}
            value={newElement[field.name]}
            onChange={(e) => setNewElement({ ...newElement, [field.name]: e.value })}
            required={field.required}
          />
        );
      case 'dynamic-dropdown':
        let dropdownOptions = [];
        if (newElement['entity_type'] === 'article') {
          dropdownOptions = field.dropdownOptions.articles;
        } else if (newElement['entity_type'] === 'ad') {
          dropdownOptions = field.dropdownOptions.ads;
          console.log(dropdownOptions);
        } else if (newElement['entity_type'] === 'comment') {
          dropdownOptions = field.dropdownOptions.comments;
        } else if (newElement['entity_type'] === 'message') {
          dropdownOptions = field.dropdownOptions.messages;
        }
        let optionLabel = 'name';
        if (newElement['entity_type'] === 'article') {
          optionLabel = 'title_ar';
        } else if (['comment', 'message'].includes(newElement['entity_type'])) {
          optionLabel = 'description';
        }
        return (
          <Dropdown
            optionLabel={optionLabel}
            optionValue='id'
            options={dropdownOptions}
            className='w-full'
            name={field.name}
            placeholder={field.placeholder}
            value={newElement[field.name]}
            onChange={(e) => setNewElement({ ...newElement, [field.name]: e.value })}
            required={field.required}
            disabled={!newElement['entity_type']}
          />
        );
      case 'dependent-dropdown':
        const filteredOptions = field.dropdownOptions.filter((option) => option[field.parentName] === newElement[field.parentName]);
        return (
          <Dropdown
            optionLabel={field.optionLabel || 'name'}
            optionValue='id'
            options={filteredOptions}
            className='w-full'
            name={field.name}
            placeholder={field.placeholder}
            value={newElement[field.name]}
            onChange={(e) => setNewElement({ ...newElement, [field.name]: e.value })}
            required={field.required}
            disabled={!newElement[field.parentName]}
          />
        );
      case 'text':
        return (
          <MemoizedInputText
            type='text'
            className='w-full'
            name={field.name}
            placeholder={field.placeholder}
            value={newElement[field.name] || ''}
            onChange={handleAddElementInputChange}
            onInvalid={(e) => e.target.setCustomValidity('هذا الحقل مطلوب')}
            required={field.required}
          />
        );
      case 'number':
        return (
          <MemoizedInputText
            type='number'
            className='w-full'
            name={field.name}
            placeholder={field.placeholder}
            value={newElement[field.name] || ''}
            onChange={handleAddElementInputChange}
            onInvalid={(e) => e.target.setCustomValidity('هذا الحقل مطلوب')}
            required={field.required}
          />
        );
      case 'image':
        return (
          <div className='flex gap-4 w-full py-4'>
            <span>{field.placeholder}</span>
            <input
              name={field.name}
              type='file'
              accept='image/*,video/*'
              multiple={uploadOptions?.multiple}
              onChange={handleAddElementFilesChange}
              onInvalid={(e) => e.target.setCustomValidity('هذا الحقل مطلوب')}
              required={field.required}
            />
          </div>
        );
      case 'color':
        return (
          <div className='flex gap-2 w-full py-4'>
            <span>{field.placeholder}</span>
            <ColorPicker
              name={field.name}
              format='hex'
              value={newElement[field.name] || ''}
              onChange={handleAddElementInputChange}
              onInvalid={(e) => e.target.setCustomValidity('هذا الحقل مطلوب')}
              required={field.required}
            />
          </div>
        );
      case 'chips':
        if (field?.showDependency && newElement[field?.showDependency.name] !== field?.showDependency.value) return null;
        return (
          <div className='flex gap-2 w-full'>
            <Chips
              name={field.name}
              placeholder={field.placeholder}
              value={newElement[field.name] || []}
              className='max-w-20rem'
              onChange={(e) => setNewElement({ ...newElement, [field.name]: e.value })}
              onInvalid={(e) => e.target.setCustomValidity('هذا الحقل مطلوب')}
              required={field.required}
            />
          </div>
        );
      case 'dynamic':
        let referenceValue = field.referenceOptions?.find((option) => option.id === newElement[field.referenceField]);
        switch (referenceValue?.data_type) {
          case 'date':
            return (
              <Calendar
                name={field.name}
                placeholder={field.placeholder}
                dateFormat='yy-mm-dd'
                className='w-full'
                value={new Date(newElement[field.name] || new Date())}
                onChange={(e) => setNewElement({ ...newElement, [field.name]: formatDate(new Date(e.value)) })}
                onInvalid={(e) => e.target.setCustomValidity('هذا الحقل مطلوب')}
                required={field.required}
              />
            );
          case 'dropdown':
            console.log(referenceValue);
            return (
              <MultiSelect
                options={referenceValue.options}
                className='min-w-full w-max'
                showSelectAll={false}
                display='chip'
                closeIcon={false}
                maxSelectedLabels={referenceValue.allow_multiselect ? referenceValue.options.length : 1}
                name={field.name}
                placeholder={field.placeholder}
                value={newElement[field.name]}
                onChange={(e) => setNewElement({ ...newElement, [field.name]: e.value })}
                required={field.required}
              />
            );
          case 'number':
            return (
              <MemoizedInputText
                type='number'
                className='w-full'
                name={field.name}
                placeholder={field.placeholder}
                value={newElement[field.name] || ''}
                onChange={handleAddElementInputChange}
                onInvalid={(e) => e.target.setCustomValidity('هذا الحقل مطلوب')}
                required={field.required}
              />
            );
          default:
            return (
              <MemoizedInputText
                type='text'
                className='w-full'
                name={field.name}
                placeholder={field.placeholder}
                value={newElement[field.name] || ''}
                onChange={handleAddElementInputChange}
                onInvalid={(e) => e.target.setCustomValidity('هذا الحقل مطلوب')}
                required={field.required}
                disabled={!newElement[field.referenceField]}
              />
            );
        }
      default:
        return null;
    }
  };

  const getColumnFilterElement = (column, options) => {
    switch (column?.filterType) {
      case 'dropdown':
        return (
          <MultiSelect
            value={options.value}
            options={column.dropdownOptions}
            onChange={(e) => options.filterCallback(e.value)}
            optionLabel='name'
            optionValue='id'
            selectAllLabel='تحديد الكل'
            showSelectAll
            placeholder='اختر من القائمة'
            className='w-full p-column-filter'
          />
        );
      case 'date':
        return (
          <Calendar
            value={options.value}
            onChange={(e) => options.filterCallback(e.value, options.index)}
            dateFormat='yy-mm-dd'
            placeholder={`ابحث باستخدام ${column.header}`}
            className='w-full p-column-filter'
            tabIndex={-1}
          />
        );
      case 'text':
        return (
          <InputText
            value={options.value}
            onChange={(e) => options.filterCallback(e.target.value)}
            placeholder={`ابحث باستخدام ${column.header}`}
            className='w-full p-column-filter'
          />
        );
      case 'number':
        return (
          <InputNumber
            value={options.value}
            onValueChange={(e) => options.filterCallback(e.value)}
            placeholder={`ابحث باستخدام ${column.header}`}
            className='w-full p-column-filter'
          />
        );
      default:
        return null;
    }
  };

  const getColumnFilterApply = (column, options) => {
    if (column?.filterType) {
      return <Button type='button' label='تصفية' onClick={options.filterApplyCallback} severity='info'></Button>;
    }
  };

  return (
    <div className='w-full'>
      <Toast ref={toast} />
      <ConfirmDialog tagKey={tableTitle} />
      <MediaModal
        visible={showMediaModal}
        setVisible={setShowMediaModal}
        media={mediaModalData}
        allowEdit={isMediaModalEditing}
        uploadOptions={uploadOptions}
      />
      <div className='w-full flex flex-column align-items-center justify-content-center gap-3'>
        <Card title={tableTitle} className='w-full shadow-7 p-2'>
          <DataTable
            header={tableHeader}
            loading={loading}
            value={elements}
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            onRowEditComplete={onRowEditComplete}
            selection={selectedElement}
            onSelectionChange={(e) => setSelectedElement(e.value)}
            filters={filters}
            filterDisplay='menu'
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={customSort}
            selectionMode='single'
            editMode='row'
            dataKey='id'
            paginator
            showGridlines
            stripedRows
            scrollable
            scrollHeight='30rem'
            emptyMessage='لا يوجد بيانات'
          >
            <Column selectionMode='single' className='w-1rem text-start' />
            {columns.map((column) => (
              <Column
                key={column.field}
                field={column.field}
                header={column.header}
                headerClassName={column.headerClassName || 'text-start'}
                className={column.className}
                body={(rowData) => showColumnBody(column, rowData)}
                editor={(options) => showColumnEditor(column, options)}
                filterElement={(options) => getColumnFilterElement(column, options)}
                filterClear={() => null}
                filterApply={(options) => getColumnFilterApply(column, options)}
                showFilterMatchModes={false}
                showFilterOperator={false}
                showFilterMenu={column.filterType ? true : false}
                filterMenuClassName='w-18rem max-w-18rem'
                filter
                sortable={column.sortable}
              />
            ))}
            {noEdit ? null : <Column rowEditor header='تعديل' className='text-start' />}
          </DataTable>
        </Card>
      </div>
      {formFields && (
        <Dialog
          header='إضافة عنصر جديد'
          visible={showAddElementModal}
          onHide={() => {
            setShowAddElementModal(false);
            setNewElement({});
          }}
          draggable={false}
          resizable={false}
        >
          <form className='flex gap-5'>
            <div className='flex flex-column justify-content-start align-items-start gap-2'>
              {formFields.map(
                (field, index) =>
                  index < singleCount && (
                    <div key={index} className='w-full flex flex-column justify-content-start align-items-start gap-2'>
                      {showFormField(field)}
                      {field.required && <small className='text-red-500'>هذا الحقل مطلوب</small>}
                      {index === singleCount - 1 && <Button label='اضافة' severity='success' onClick={handleAddElement} />}
                    </div>
                  )
              )}
            </div>
            <div className='flex flex-column justify-content-start align-items-start gap-2'>
              {formFields.length > singleCount &&
                formFields.map(
                  (field, index) =>
                    index >= singleCount && (
                      <div key={index} className='w-full flex flex-column justify-content-start align-items-start gap-2'>
                        {showFormField(field)}
                        {field.required && <small className='text-red-500'>هذا الحقل مطلوب</small>}
                      </div>
                    )
                )}
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
