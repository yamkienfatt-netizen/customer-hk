import { ImageField, Image } from '@sitecore-jss/sitecore-jss-nextjs';
import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import ImageClipPath from './ImageClipPath';
import useWindowSize from 'src/hooks/useWindowSize';

const ImageHideAnimation = ({
  scImage,
  className,
}: {
  scImage: ImageField;
  className?: string;
}) => {
  const { isMobile } = useWindowSize();
  const target = useRef(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start end', 'end end'],
  });
  const clipPath = useTransform(scrollYProgress, [0, 1], ['inset(0%', 'inset(10%)']);
  // const clipPathMobile = useTransform(scrollYProgress, [0, 1], ['inset(10%)', 'inset(0%)']);
  return (
    <div>
      <div ref={target}>
        <ImageClipPath clipPath={clipPath}>
          <Image className={`relative object-cover ${className}`} field={scImage} />
        </ImageClipPath>
      </div>
    </div>
  );
};

export default ImageHideAnimation;
