import React from 'react';
import Typography from '../../Typography/Typography';

interface CatFilterProps {
  cats: string[];
  selectedCat: string;
  onClickCat: (cat: string, index: number) => void;
  className?: string;
}

const CatFilter = ({ cats, selectedCat, onClickCat, className }: CatFilterProps) => {
  return (
    <div className={`flex flex-nowrap overflow-x-auto scrollbar-hide ${className}`}>
      {cats.map((cat, index) => (
        <div key={index}>
          <Typography
            key={index}
            variant="l1"
            fontColor={selectedCat !== cat ? '#888988' : '#1d2021'}
            fontWeight="bold"
            extraStyles="mr-[20px] hover:cursor-pointer lg:border-b-[2px] inline-block whitespace-nowrap"
            onClick={() => onClickCat(cat, index)}
          >
            {cat}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default CatFilter;
