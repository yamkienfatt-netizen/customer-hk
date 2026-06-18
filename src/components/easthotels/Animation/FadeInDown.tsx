import { motion, useScroll, useTransform } from 'framer-motion';
import { PropsWithChildren, useRef } from 'react';

type Props = {
  className?: string;
} & PropsWithChildren;

const FadeInDown = ({ children, className }: Props) => {
  const target = useRef(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start end', 'end end'],
  });
  const translateYValue = useTransform(scrollYProgress, [0.8, 1], [-40, 0]);
  const opacityValue = useTransform(scrollYProgress, [0.8, 1], [0.3, 1]);

  return (
    <div ref={target}>
      <motion.div className={className} style={{ y: translateYValue, opacity: opacityValue }}>
        {children}
      </motion.div>
    </div>
  );
};

export default FadeInDown;
