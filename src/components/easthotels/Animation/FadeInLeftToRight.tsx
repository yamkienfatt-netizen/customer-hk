import { MotionValue, motion, useScroll, useTransform } from 'framer-motion';
import { PropsWithChildren, useRef } from 'react';

type Props = {
  className?: string;
} & PropsWithChildren;

const FadeInLeftToRight = ({ children, className }: Props) => {
  const target = useRef(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start end', 'end end'],
  });
  const translateXValue = useTransform(scrollYProgress, [0.8, 1], [-40, 0]);
  const opacityValue = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  return (
    <div ref={target}>
      <motion.div className={className} style={{ x: translateXValue, opacity: opacityValue }}>
        {children}
      </motion.div>
    </div>
  );
};

export default FadeInLeftToRight;
