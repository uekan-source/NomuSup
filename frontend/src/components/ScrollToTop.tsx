import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // パス（URL）が変わるたびに、画面の左上(0, 0)にスクロールする
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;