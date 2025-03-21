'use client';

import { useState, useEffect } from 'react';

/***************************  HOOKS - LOCAL STORAGE  ***************************/

export default function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue === null ? defaultValue : JSON.parse(storedValue);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  });

  useEffect(() => {
    const listener = (e) => {
      if (e.storageArea === localStorage && e.key === key) {
        try {
          setValue(e.newValue ? JSON.parse(e.newValue) : defaultValue);
        } catch (error) {
          console.error('Error parsing localStorage value:', error);
        }
      }
    };
    
    window.addEventListener('storage', listener);
    return () => {
      window.removeEventListener('storage', listener);
    };
  }, [key, defaultValue]);

  const setValueInLocalStorage = (newValue) => {
    setValue((currentValue) => {
      const result = typeof newValue === 'function' ? newValue(currentValue) : newValue;
      
      try {
        localStorage.setItem(key, JSON.stringify(result));
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
      
      return result;
    });
  };

  return [value, setValueInLocalStorage];
}
