import { MotionValue, motion, useScroll, useTransform } from 'framer-motion';
import { PropsWithChildren, useRef } from 'react';

type Props = {
  className?: string;
  scrollYProgress?: MotionValue<number>;
  translateY?: number[];
  scrollY?: number[];
  opacity?: number[];
  wrapperClassName?: string;
} & PropsWithChildren;

const FadeInUp = ({
  children,
  className,
  scrollYProgress,
  scrollY,
  translateY,
  opacity,
  wrapperClassName,
}: Props) => {
  const target = useRef(null);
  const { scrollYProgress: scrollYProgressInternal } = useScroll({
    target,
    offset: ['start end', 'end end'],
  });
  const translateYValue = useTransform(
    scrollYProgress || scrollYProgressInternal,
    scrollY || [0.8, 1],
    translateY || [40, 0]
  );
  const opacityValue = useTransform(
    scrollYProgress || scrollYProgressInternal,
    scrollY || [0.8, 1],
    opacity || [0.3, 1]
  );

  return (
    <div ref={target} className={wrapperClassName}>
      {/* <motion.div className={className} style={{ y: translateYValue, opacity: opacityValue }}> */}
      <div className={className}>{children}</div>
      {/* </motion.div> */}
    </div>
  );
};

export default FadeInUp;
