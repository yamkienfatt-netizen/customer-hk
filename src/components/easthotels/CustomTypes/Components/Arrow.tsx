import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import React from 'react';
import { motion } from 'framer-motion';

const publicUrl = getPublicUrl();

interface ArrowProps {
  className: string;
  onClick?: () => void;
  imgClassName?: string;
  containerStyle?: React.CSSProperties;
}
const arrow = {
  initial: { x: 10, opacity: 1 },
  animate: { x: -20, opacity: 0 },
};
const oppositeArrow = {
  initial: { x: 20, opacity: 0 },
  animate: { x: -10, opacity: 1 },
};

export const PrevArrow = ({ className, onClick, imgClassName, containerStyle }: ArrowProps) => (
  <motion.div
    className={className + ' select-none overflow-hidden hover:cursor-pointer'}
    onClick={onClick}
    initial="initial"
    animate="initial"
    whileHover="animate"
    transition={{ delay: 0.1 }}
    style={containerStyle}
  >
    <motion.img
      variants={arrow}
      src={`${publicUrl}/icon_arrow_left.svg`}
      alt="left_arrow"
      className={`arrow-icon ${imgClassName}`}
    />
    <motion.img
      variants={oppositeArrow}
      src={`${publicUrl}/icon_arrow_left.svg`}
      alt="left_arrow"
      className={`arrow-icon ${imgClassName}`}
    />
  </motion.div>
);

export const NextArrow = ({ className, onClick, imgClassName, containerStyle }: ArrowProps) => (
  <motion.div
    className={className + ' select-none overflow-hidden hover:cursor-pointer'}
    onClick={onClick}
    initial="animate"
    animate="animate"
    whileHover="initial"
    transition={{ delay: 0.1 }}
    style={containerStyle}
  >
    <motion.img
      variants={arrow}
      src={`${publicUrl}/icon_arrow_right.svg`}
      alt="right_arrow"
      className={`arrow-icon ${imgClassName}`}
    />
    <motion.img
      variants={oppositeArrow}
      src={`${publicUrl}/icon_arrow_right.svg`}
      alt="right_arrow"
      className={`arrow-icon ${imgClassName}`}
    />
  </motion.div>
);
