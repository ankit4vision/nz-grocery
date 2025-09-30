import React, { useState } from 'react';
import placeholderImage from '../../assets/images/placeholder.svg';
import '../../styles/components/ui-elements/image-with-fallback.css';

const ImageWithFallback = ({
  src,
  alt = 'Image',
  className = '',
  fallbackSrc = placeholderImage,
  onError,
  onLoad,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = (e) => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallbackSrc);
      onError?.(e);
    }
  };

  const handleLoad = (e) => {
    setHasError(false);
    onLoad?.(e);
  };

  const imageClasses = [
    'image-with-fallback',
    hasError ? 'image-with-fallback--error' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={imageClasses}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

export default ImageWithFallback;
