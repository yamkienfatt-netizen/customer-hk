import {
  ImageField,
  LayoutServicePageState,
  LinkField,
  Image as ScImage,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import ImageClipPath from './ImageClipPath';
import useWindowSize from 'src/hooks/useWindowSize';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import AutoplayVideo from '../Media/AutoPlayVideo';

const publicUrl = getPublicUrl();

const ImageRevealAnimation = ({
  img,
  scImage,
  scVideo,
  className,
  height,
  width,
  containerClassName,
  srcSetArr,
  sizes,
}: {
  img?: string;
  scImage?: ImageField;
  scVideo?: LinkField;
  className?: string;
  height?: number | string;
  width?: number | string;
  containerClassName?: string;
  srcSetArr?: { mw: number }[];
  sizes?: string;
}) => {
  const context = useSitecoreContext();
  const isPageEditing = context.sitecoreContext.pageState === LayoutServicePageState.Edit;

  const { isMobile } = useWindowSize();
  const target = useRef(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start end', 'end end'],
  });
  const clipPath = useTransform(scrollYProgress, [0, 1], ['inset(30%)', 'inset(0%)']);
  const clipPathMobile = useTransform(scrollYProgress, [0, 1], ['inset(10%)', 'inset(0%)']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  return (
    <div className={`mt-[0px]`}>
      <div ref={target} className="overflow-hidden">
        {isPageEditing && scVideo && (
          <>
            <span>
              Video link: <SitecoreLink field={scVideo!} />
            </span>
            <br />
          </>
        )}

        {isPageEditing && <ScImage field={scImage} />}

        {!isPageEditing && (
          <ImageClipPath
            clipPath={isMobile ? clipPathMobile : clipPath}
            className={containerClassName}
          >
            {scVideo?.value?.href ? (
              <AutoplayVideo videoSrcURL={scVideo?.value?.href} style={{ height, width }} />
            ) : img ? (
              <motion.img
                src={`${publicUrl}${img}`}
                alt="brand_about_temp"
                className={`relative object-cover ${className}`}
                style={{ scale, height, width }}
              />
            ) : (
              // <motion.img
              //   className={`relative object-cover ${className}`}
              //   src={scImage?.value?.src}
              //   style={{ scale, height, width }}
              //   srcSet={
              //     srcSetArr?.length == 1
              //       ? `${scImage?.value?.src} ${srcSetArr[0]}`
              //       : srcSetArr?.length == 2
              //         ? `${scImage?.value?.src} ${srcSetArr[0]}, ${scImage?.value?.src} ${srcSetArr[1]}`
              //         : undefined
              //   }
              //   sizes={sizes ? sizes : undefined}
              // />

              <motion.div>
                <ScImage
                  className={`relative object-cover ${className}`}
                  style={{ scale, height, width }}
                  field={scImage}
                  srcSet={srcSetArr}
                  sizes={sizes ? sizes : undefined}
                />
              </motion.div>
            )}
          </ImageClipPath>
        )}
      </div>
    </div>
  );
};

export default ImageRevealAnimation;
