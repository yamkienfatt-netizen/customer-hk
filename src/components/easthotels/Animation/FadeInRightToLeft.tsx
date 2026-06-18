import { motion, useScroll, useTransform } from 'framer-motion';
import { PropsWithChildren, useRef } from 'react';

type Props = {
  className?: string;
  scrollY?: number[];
} & PropsWithChildren;

const FadeInRightToLeft = ({ children, className, scrollY }: Props) => {
  const target = useRef(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start end', 'end end'],
  });
  const translateXValue = useTransform(scrollYProgress, scrollY || [0.6, 1], [40, 0]);
  const opacityValue = useTransform(scrollYProgress, scrollY || [0.6, 1], [0.3, 1]);
  return (
    <div ref={target}>
      <motion.div className={className} style={{ x: translateXValue, opacity: opacityValue }}>
        {children}
      </motion.div>
    </div>
  );
};

export default FadeInRightToLeft;
