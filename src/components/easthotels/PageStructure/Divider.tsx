import { cn } from 'lib/utils';
const Default = (DividerProps) => {
  const isCenter = DividerProps.params?.Styles.includes('Center') ? '!max-w-[768px] mx-auto' : '';

  return <hr className={cn('my-[30px] lg:my-[50px]', isCenter)} />;
};

export default Default;
