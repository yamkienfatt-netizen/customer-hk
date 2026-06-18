import React from 'react';
import parse from 'html-react-parser';
import Typography from './Typography';

// reusable module
const RichTextTypography = ({
  children,
  isMeetingFloorplan = true,
  className
}: {
  children: React.ReactNode;
  isMeetingFloorplan?: boolean;
  className?: string;
}) => {
  // const parsedText = parse(children);

  return (
    <Typography variant="p" className={className}>
      <div
        className={`${isMeetingFloorplan ? 'richtext' : 'richtextMeetingFloorplan'} with-arrow overflow-auto `}
      >
        {children}
      </div>
    </Typography>
  );
};

export default RichTextTypography;
