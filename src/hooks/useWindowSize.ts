import { useEffect, useState } from 'react';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{
    width?: number;
    height?: number;
  }>({
    width: undefined,
    height: undefined,
  });

  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);
  const [isDesktop, setIsDesktop] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth <= 991;
      const desktop = window.innerWidth >= 992;
      setIsMobile(mobile);
      setIsDesktop(desktop);
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Check if window object is available
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }

    return;
  }, []);
  return { isMobile, isDesktop, windowSize };
};

export default useWindowSize;
