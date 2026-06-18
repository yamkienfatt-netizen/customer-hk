import React, { useRef, JSX } from 'react';
import {
  Text as ScText,
  Image as ScImage,
  ImageField,
  TextField,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';

import { ImageBanner4Props } from '@/props/Media/ImageBannerProps';
import { motion, useScroll, useTransform } from 'framer-motion';
import BannerTextSectionContent from 'components/easthotels/Banner/BannerTextSectionContent';
import HeaderSection from 'components/easthotels/Navigation/HeaderSection';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import BannerTextSectionHeader from '../Banner/BannerTextSectionHeader';
import ComponentError from '../Error/ComponentError';
const publicUrl = getPublicUrl();
interface ImageContainerProps {
  topImage: ImageField;
  bottomImage: ImageField;
  className: string;
}
const ImageContainerLeft = ({ topImage, bottomImage, className }: ImageContainerProps) => {
  try {
    const target = useRef(null);
    const { scrollYProgress } = useScroll({
      target,
      offset: ['start end', 'end end'],
    });
    const translateY = useTransform(scrollYProgress, [0.3, 0.9], ['0%', '-100%']);

    return (
      <motion.div ref={target} style={{ translateY }} className={` ${className}`}>
        <ScImage
          field={topImage}
          className="aspect-[290/414] w-[290px] object-cover"
          srcSet={[{ mw: 290 }]}
          sizes="290px"
        />
        <ScImage
          field={bottomImage}
          className="mt-[40px] aspect-[290/414] w-[290px] object-cover"
          srcSet={[{ mw: 290 }]}
          sizes="290px"
        />
        <ScImage
          field={topImage}
          className="mt-[40px] aspect-[290/414] w-[290px] object-cover"
          srcSet={[{ mw: 290 }]}
          sizes="290px"
        />
      </motion.div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
const ImageContainerRight = ({ topImage, bottomImage, className }: ImageContainerProps) => {
  try {
    const target = useRef(null);
    const { scrollYProgress } = useScroll({
      target,
      offset: ['start end', 'end end'],
    });
    const translateY = useTransform(scrollYProgress, [0.4, 0.9], ['-85%', '20%']);

    return (
      <motion.div ref={target} style={{ translateY }} className={` ${className}`}>
        <ScImage
          field={topImage}
          className="aspect-[290/414] w-[290px]"
          srcSet={[{ mw: 290 }]}
          sizes="290px"
        />
        <ScImage
          field={bottomImage}
          className="mt-[40px] aspect-[290/414] w-[290px]"
          srcSet={[{ mw: 290 }]}
          sizes="290px"
        />
      </motion.div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const Default = (ImageBanner4Data: ImageBanner4Props): JSX.Element => {
  try {
    const { Image1, Image2, Image3, Image4 } = ImageBanner4Data.fields;
    const imageArray = [Image1, Image2, Image3, Image4];
    const sitecoreCss = ImageBanner4Data.params?.Styles ?? '';

    let propFieldsWithoutSubHeader = JSON.parse(JSON.stringify(ImageBanner4Data.fields));
    delete propFieldsWithoutSubHeader.Subheading;

    return (
      <div className={`medium-section-container lg:!max-w-[1440px] ${sitecoreCss}`}>
        <div className="mx-[15px] lg:hidden">
          <div className="overflow-hidden">
            <Swiper
              slidesPerView={1}
              modules={[EffectCoverflow, Autoplay]}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              effect="coverflow"
              coverflowEffect={{
                rotate: 0,
                slideShadows: false,
                scale: 1.5,
                depth: 150,
              }}
              className="aspect-square h-[100%] w-full"
              loop={true}
              speed={1000}
            >
              {
                /* Mobile images */
                imageArray &&
                  imageArray.map((image: ImageField) => (
                    <SwiperSlide>
                      <ScImage
                        field={image}
                        className="h-full w-full object-cover"
                        srcSet={[{ mw: 510 }]}
                        sizes="510px"
                      />
                    </SwiperSlide>
                  ))
              }
            </Swiper>
          </div>
          <div className=" mt-[40px]">
            <BannerTextSectionHeader {...ImageBanner4Data.fields} />
            <div className="mt-[-30px]">
              <BannerTextSectionContent {...propFieldsWithoutSubHeader} />
            </div>
          </div>
        </div>
        <div className="hidden  justify-between gap-8 lg:mx-[50px] lg:flex">
          <div className="flex flex-col justify-center lg:w-[400px] xl:w-[500px]">
            <HeaderSection heading2={ImageBanner4Data.fields.Heading as TextField} heading1={''} />
            <div className="mt-[280px] ">
              <FadeInUp>
                <BannerTextSectionContent {...ImageBanner4Data.fields} />
              </FadeInUp>
            </div>
          </div>
          <div className="flex max-h-[800px] justify-between overflow-hidden">
            <ImageContainerLeft
              topImage={Image1}
              bottomImage={Image2}
              className="mr-[15px] mt-[80px]"
            />
            <ImageContainerRight
              topImage={Image3}
              bottomImage={Image4}
              className="ml-[15px] flex-col"
            />
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<ImageBanner4Props>(Default);
