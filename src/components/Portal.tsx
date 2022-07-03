import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type PropsType = {
  children: ReactNode;
};

const Portal = ({ children }: PropsType) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  if (typeof window === 'object') {
    const element = document.querySelector('#modal-root');
    return mounted && element ? createPortal(children, element) : null;
  }
  return null;
};

export default Portal;
