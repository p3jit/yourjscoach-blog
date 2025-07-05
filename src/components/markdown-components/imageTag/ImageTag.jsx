import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { DarkModeProvider } from '../../../contexts/DarkModeContext';
import { useResponsive } from '../../../hooks/useResponsive';

const containerClasses = {
  base: 'w-auto rounded-md p-3 my-5',
  dark: 'ring-zinc-700 ring-1',
};

const ImageTag = ({ children, index, identifier }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [isLoaded, setIsLoaded] = useState(false);
  
  const imageLink = children[0]?.props?.href
    ? String(children[0].props.href)
    : `/images/${identifier}/${identifier}_${index}.png`;
  
  const altText = String(children[0] || '');
  
  // Calculate dimensions based on screen size
  const dimensions = (() => {
    if (isMobile) {
      return { width: '100%', maxHeight: '300px' };
    } else if (isTablet) {
      return { width: '100%', maxHeight: '400px' };
    } else {
      return { width: '80%', maxHeight: '600px' };
    }
  })();

  const containerClassName = `${containerClasses.base} ${
    !isDarkMode ? containerClasses.dark : ''
  }`;

  // Generate a low-quality preview (LQIP) by reducing quality
  const previewSrc = `${imageLink}${imageLink.includes('?') ? '&' : '?'}quality=5&blur=10`;
  const fullSrc = `${imageLink}${imageLink.includes('?') ? '&' : '?'}quality=70`;

  return (
    <div className={containerClassName}>
      <div style={{
        width: dimensions.width,
        maxWidth: '100%',
        margin: '0 auto',
        position: 'relative',
      }}>
        {/* Low-quality image preview */}
        <img
          src={previewSrc}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'blur(8px)',
            opacity: isLoaded ? 0 : 1,
            transition: 'opacity 0.5s ease-out',
          }}
        />
        
        {/* Main image */}
        <img
          src={fullSrc}
          alt={altText}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: dimensions.maxHeight,
            objectFit: 'contain',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in',
          }}
          onError={(e) => {
            // Fallback to original src if the quality parameter causes issues
            if (e.target.src !== imageLink) {
              e.target.src = imageLink;
            }
          }}
        />
      </div>
    </div>
  );
};

export default ImageTag;
