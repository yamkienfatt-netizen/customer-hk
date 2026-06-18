import * as React from 'react';
import { LoadingButton } from '@/components/ui/loading-button';

export default ({
  loading,
  isDisabled,
  onClick,
  children,
  className,
}: {
  loading: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className: string;
}) => {
  return (
    <LoadingButton
      className={
        className
          ? className
          : 'my-[50px] w-full items-center justify-center bg-green-primary py-[17px]'
      }
      loading={loading}
      disabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </LoadingButton>
  );
};
