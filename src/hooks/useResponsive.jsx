import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";

export const useResponsive = () => {
  const [state, setState] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  const onResize = () => {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth <= 990;
    const isDesktop = window.innerWidth >= 990;

    setState({ isMobile, isTablet, isDesktop });
  };

  const onResizeDebounced = useDebounce(onResize, 1000);

  const setup = () => {
    window.addEventListener("resize", onResizeDebounced, false);
  };

  const cleanup = () => {
    window.removeEventListener("resize", onResizeDebounced, false);
  };

  useEffect(() => {
    setup();
    return () => {
      cleanup();
    };
  }, []);

  const { isMobile, isTablet, isDesktop } = state;
  return { isMobile, isTablet, isDesktop };
};
