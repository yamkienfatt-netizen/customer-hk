import { cn } from 'lib/utils';
import React from 'react';

type TypographyProps = {
  variant: string;
  font?: string;
  fontColor?: string;
  bgColor?: string;
  fontWeight?: string;
  hoverEffect?: string;
  underline?: boolean;
  children: React.ReactNode;
  extraStyles?: string;
  className?: string;
  onClick?: () => void;
};

type HeadingStyles = {
  [key: string]: any;
};

const headingStyles: HeadingStyles = {
  // h1: 'text-[40px] leading-[40px] lg:text-[50px] lg:leading-[50px]',
  // 'inner-h1': 'text-[40px] leading-[40px] lg:text-[60px] lg:leading-[60px]',
  // h2: 'text-[30px] leading-[30px] lg:text-[40px] lg:leading-[40px]',
  // h3: 'text-[25px] leading-[25px] lg:text-[30px] lg:leading-[30px]',
  // h4: 'text-[18px] leading-[20px] lg:text-[20px] lg:leading-[20px]',
  // p: 'text-[13px] leading-[18px]',
  // l1: 'text-[11px] leading-[16px] tracking-[0.88px]',
  // l2: 'text-[11px] leading-[16px]',
  // l3: 'text-[12px] lg:text-[14px] leading-[18px] tracking-[0.88px]',
  // Amiko: 'font-[Amiko]',
  // Bellefair: 'font-[Bellefair]',
  // regular: 'font-normal',
  // bold: 'font-bold',
  // semiBold: 'font-semibold',
  // hoverUnderline:
  //   'border-b-[2px] border-transparent hover:border-black-secondary hover:cursor-pointer',
  // underline: 'border-b-[2px]  inline-block',

  h1: 'text-[37px] leading-tight lg:text-[56px] uppercase',
  // h1: 'text-[46px] leading-[46px] lg:text-[56px] lg:leading-[56px]',
  'inner-h1': 'text-[46px] leading-tight lg:text-[66px] uppercase',
  // 'inner-h1': 'text-[46px] leading-[46px] lg:text-[66px] lg:leading-[66px]',
  h2: 'text-[36px] leading-tight lg:text-[46px] uppercase',
  // h2: 'text-[36px] leading-[36px] lg:text-[46px] lg:leading-[46px]',
  h3: 'text-[28px] leading-tight lg:text-[33px] uppercase',
  // h3: 'text-[28px] leading-[28px] lg:text-[33px] lg:leading-[33px]',
  h4: 'text-[21px] leading-tight lg:text-[23px] uppercase',
  // h4: 'text-[21px] leading-[23px] lg:text-[23px] lg:leading-[23px]',
  p: 'text-[16px] leading-[21px]',
  l1: 'text-[13px] leading-[18px] tracking-[0.88px]', //only added 2px so hero banner won't break
  l2: 'text-[13px] leading-[18px]',
  l3: 'text-[15px] lg:text-[17px] leading-[21px] tracking-[0.88px]',
  Amiko: 'font-[Amiko]',
  Bellefair: 'font-[Bellefair]',
  extralight: 'font-extralight',
  regular: 'font-normal',
  bold: 'font-bold',
  semiBold: 'font-semibold',
  hoverUnderline:
    'border-b-[2px] border-transparent hover:border-black-secondary hover:cursor-pointer',
  underline: 'border-b-[2px]  inline-block',
  sso_title1: 'text-[20px] leading-[20px] uppercase',
  sso_title2: 'text-[11px] leading-[18px] uppercase',
  sso_btn_text: 'text-[14px] leading-[20px] uppercase',
  sso_track: 'text-[11px] leading-[18px] tracking-[0.88px] uppercase',
};

const Typography = ({
  variant,
  font = 'Amiko',
  fontColor,
  bgColor,
  fontWeight = 'regular',
  hoverEffect,
  underline,
  children,
  extraStyles,
  onClick,
  className,
  ...props
}: TypographyProps) => {
  const styles = `${extraStyles || ''} ${headingStyles[variant] || ''} ${headingStyles[font] || ''} ${
    headingStyles[fontWeight] || ''
  } ${hoverEffect ? headingStyles[hoverEffect] : ''} ${underline ? headingStyles['underline'] : ''}`;

  const dynamicStyles = {
    color: fontColor,
    borderColor: fontColor,
    backgroundColor: bgColor,
  };

  return (
    <p className={cn(styles, className)} style={dynamicStyles} onClick={onClick} {...props}>
      {children}
    </p>
  );
};

export default Typography;
