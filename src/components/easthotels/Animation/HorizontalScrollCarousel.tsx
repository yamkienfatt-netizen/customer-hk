import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef, PropsWithChildren } from 'react';
import useWindowSize from 'src/hooks/useWindowSize';

interface HorizontalScrollCarouselProps {
  endPoint: string;
}

const HorizontalScrollCarousel = ({
  children,
  endPoint = '-40%',
}: PropsWithChildren<HorizontalScrollCarouselProps>) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], [endPoint, '30%']);
  const { isMobile } = useWindowSize();

  return (
    <section ref={targetRef} className="relative">
      <div className="flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-3" key={JSON.stringify(isMobile)}>
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default HorizontalScrollCarousel;
