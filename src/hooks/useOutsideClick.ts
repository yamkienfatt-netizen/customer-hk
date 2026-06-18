import React, { useEffect, useState } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref & return is outside clicked
 */
const useOutsideClick = (ref) => {
  const [isOutsideClicked, setIsOutsideClicked] = useState(false);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        // alert('You clicked outside of me!');
        setIsOutsideClicked(true);
      } else {
        setIsOutsideClicked(false);
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return isOutsideClicked;
};

export default useOutsideClick;
