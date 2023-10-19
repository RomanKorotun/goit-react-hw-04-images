import React, { useState } from 'react';
import { PhotoCard } from './ImageGalleryItem.styled';
import { ModalContainer } from 'components/Modal/Modal';

export const ImageGalleryItem = ({ webformatURL, largeImageURL, tags }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <PhotoCard>
      <img
        onClick={openModal}
        src={webformatURL}
        alt={tags}
        loading="lazy"
        width="334"
        height="270"
      />
      <ModalContainer
        largeImageURL={largeImageURL}
        isModalOpen={isModalOpen}
        onCloseModal={closeModal}
        tags={tags}
      />
    </PhotoCard>
  );
};
