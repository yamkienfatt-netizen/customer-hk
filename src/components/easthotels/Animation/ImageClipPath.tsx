import { MotionValue } from 'framer-motion';
import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';
import useWindowSize from 'src/hooks/useWindowSize';

type Props = {
  clipPath: MotionValue<string>;
  className?: string;
};

const ImageClipPath = ({ children, clipPath, className }: PropsWithChildren<Props>) => {
  const { isMobile } = useWindowSize();

  return (
    <motion.div style={{ clipPath }} key={JSON.stringify(isMobile)} className={className}>
      {children}
    </motion.div>
  );
};

export default ImageClipPath;
