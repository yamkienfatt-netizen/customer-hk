import React from 'react';
import { motion } from 'framer-motion';
import { ImageField } from '@sitecore-jss/sitecore-jss-nextjs';

interface ImageClipOnHoverEffectProps {
  src: string | ImageField;
  alt: string;
  className?: string;
}

const ImageClipOnHover = ({ src, alt, className }: ImageClipOnHoverEffectProps) => {
  return (
    <motion.img
      src={typeof src === 'string' ? src : src?.value?.src}
      alt={alt}
      className={`clip-path-image ${className}`}
      whileHover={{ clipPath: 'inset(3%)' }}
    />
  );
};

export default ImageClipOnHover;
