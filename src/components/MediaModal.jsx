import React, { useEffect, useRef, useState } from 'react';
import { Carousel } from 'primereact/carousel';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

export default function MediaModal({ visible, setVisible, media, allowEdit, uploadOptions }) {
  const toast = useRef(null);
  const [currentMedia, setCurrentMedia] = useState({ data: [], type: '', entityId: '' });
  const [currentEntityId, setCurrentEntityId] = useState(null);
  const [removedImages, setRemovedImages] = useState([]);
  const [removedVideos, setRemovedVideos] = useState([]);

  useEffect(() => {
    setCurrentMedia(media);
    setCurrentEntityId(media.entityId);
  }, [media]);

  const mediaTemplate = (mediaLink) => {
    return (
      <div className='border-1 surface-border border-round text-center p-1'>
        {currentMedia.type.includes('video') ? (
          <video
            src={`${mediaLink.includes('blob') ? '' : process.env.REACT_APP_BASE_IMAGE_URL}${mediaLink}`}
            controls
            className='w-9 max-w-30rem shadow-2'
          />
        ) : (
          <img
            src={`${mediaLink.includes('blob') ? '' : process.env.REACT_APP_BASE_IMAGE_URL}${mediaLink}`}
            alt=''
            className='w-9 max-w-30rem shadow-2'
            loading='lazy'
          />
        )}
        {allowEdit && (
          <div className='flex justify-content-center align-items-center'>
            <Button type='button' icon='pi pi-trash' label='حذف' className='p-button-danger' onClick={() => handleRemoveMedia(mediaLink)} />
          </div>
        )}
      </div>
    );
  };

  const handleRemoveMedia = (link) => {
    const newData = currentMedia.data.filter((item) => item !== link);
    setCurrentMedia({ ...currentMedia, data: newData });
    if (!link.includes('blob')) {
      if (currentMedia.type.includes('video')) {
        setRemovedVideos([...removedVideos, link]);
      } else {
        setRemovedImages([...removedImages, link]);
      }
    }
  };

  const handleSaveChanges = async (link) => {
    let removedData = {};
    if (removedImages.length) {
      removedData[uploadOptions.key === 'media' ? 'images' : uploadOptions.key] = removedImages;
    } else if (removedVideos.length) {
      removedData.videos = removedVideos;
    }
    if (Object.keys(removedData).length) {
      let response = await uploadOptions.deleteHandler(currentEntityId, removedData);
      if (response.status !== 200) {
        toast.current.show({ severity: 'error', summary: 'عملية فاشلة', detail: 'حدث خطاء في حذف الملفات', life: 1000 });
        return;
      }
    }
    toast.current.show({ severity: 'success', summary: 'عملية ناجحة', detail: 'تم حفظ التغييرات بنجاح', life: 1000 });
    localStorage.removeItem('ecommerce-dashboard');
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header='الوسائط'
        visible={visible}
        onHide={() => setVisible(false)}
        className='flex flex-column w-full md:w-6'
        draggable={false}
        resizable={false}
      >
        {currentMedia.data && currentMedia.data?.length ? (
          currentMedia.data[0].includes('m4a') ? (
            <audio src={`${process.env.REACT_APP_BASE_IMAGE_URL}${currentMedia.data[0]}`} controls></audio>
          ) : (
            <Carousel className='dir-ltr' value={currentMedia.data} itemTemplate={mediaTemplate} numVisible={1} numScroll={1} showIndicators />
          )
        ) : (
          <span className='text-xl'>لا يوجد وسائط حاليا</span>
        )}
        {allowEdit && <Button label='حفظ التغييرات' className='p-button-success' onClick={handleSaveChanges} />}
      </Dialog>
    </>
  );
}
