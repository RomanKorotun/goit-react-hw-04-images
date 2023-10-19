import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { SearchBar } from './Searchbar/Searchbar';
import { serviceSearch } from 'api';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { Error, Info } from './Message';
import { Layout } from './Layout';

export const App = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [showLoadMode, setShowLoadMode] = useState(false);

  const handlerSubmit = inputValue => {
    setQuery(inputValue);
    setPage(1);
    setGalleryItems([]);
    setShowLoadMode(false);
  };

  const handlerLoadMore = () => {
    setPage(prevstate => prevstate + 1);
  };

  useEffect(() => {
    if (query === '') {
      return;
    }
    async function search() {
      try {
        setLoading(true);
        setError(false);
        setIsEmpty(false);

        const data = await serviceSearch(page, query);

        if (page === 1 && data.totalHits > 1) {
          toast.success(`Hooray! We found ${data.totalHits} images!`);
        }

        if (page >= Math.ceil(data.totalHits / 12) && data.totalHits !== 0) {
          toast("We're sorry, but you've reached the end of search results.");
        }

        setIsEmpty(() => {
          if (data.hits.length === 0) {
            return true;
          }
        });

        setGalleryItems(prevState => [...prevState, ...data.hits]);
        setShowLoadMode(page < Math.ceil(data.totalHits / 12));
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    search();
  }, [page, query]);

  return (
    <Layout>
      <SearchBar onSubmit={handlerSubmit} />
      {error && <Error>Error! Try reloading the page...</Error>}
      {isEmpty && (
        <Info>Your search did not match anything. Please try again.</Info>
      )}
      {galleryItems.length > 0 && <ImageGallery galleryItems={galleryItems} />}
      {(loading && <Loader />) ||
        (showLoadMode && <Button onLoadMore={handlerLoadMore} />)}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </Layout>
  );
};
