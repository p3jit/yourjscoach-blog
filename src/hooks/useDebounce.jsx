import { useCallback, useRef } from "react";

const useDebounce = (fn, delay) => {
  const timerRef = useRef();
  const debounce = useCallback(
    function (...args) {
      const context = this;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fn.apply(context, [...args]);
      }, delay);
    },
    [fn, delay]
  );
  return debounce;
};

export default useDebounce;
