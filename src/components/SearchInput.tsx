import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useState,
} from 'react';

import { useThemeContext } from '@/components/ThemeContext';

type PropsType = {
  onSearchChange: (query: string) => void;
};

const SearchInput = ({ onSearchChange }: PropsType) => {
  const { textColor, bgColor } = useThemeContext();
  const [query, setQuery] = useState('');
  const deferredQueryValue = useDeferredValue(query);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  // * Autofocus input element via useCallback, interesting ...
  // Probably not going to use this extensively with the production code, ref + effect seems to be more syntactically sound
  const inputEl = useCallback((inputElement: HTMLInputElement) => {
    if (inputElement) inputElement.focus();
  }, []);

  useEffect(() => {
    onSearchChange(deferredQueryValue || '');
  }, [deferredQueryValue]);

  return (
    <form className='max-w-md'>
      <div className='relative'>
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          <svg
            className={`h-5 w-5 ${textColor}`}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            ></path>
          </svg>
        </div>
        <input
          type='search'
          ref={inputEl}
          className={`block w-full rounded-lg border border-gray-300 ${bgColor} py-2 px-4 pl-10 text-sm ${textColor} focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600`}
          placeholder='Search Collections...'
          onChange={handleSearch}
          required
          autoFocus
        />
      </div>
    </form>
  );
};

export default SearchInput;
