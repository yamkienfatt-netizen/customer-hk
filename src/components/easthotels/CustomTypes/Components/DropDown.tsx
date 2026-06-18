import React from 'react';
import { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Typography from '../../Typography/Typography';
import { Text as ScText, TextField, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecoreLink } from './SitecoreLink';

interface DropDownProps {
  dropdownItems: { href?: LinkField | TextField | string; text: TextField | string }[];
  children: ReactNode;
  minWidth?: string;
  Width?: string | number;
  Height?: string | number;
  isDemo?: boolean;
  onItemSelected: (name: string, id?: string) => void;
}

export default function DropDown({
  dropdownItems,
  children,
  minWidth,
  Width,
  Height,
  isDemo = false,
  onItemSelected,
}: DropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={`min-w-[${minWidth}] w-[${Width}] h-[${Height || 0}px] lg:h-auto`}
        style={{
          WebkitAppearance: 'none',
        }}
      >
        <div
          className="hover:cursor-pointer"
          style={{
            WebkitAppearance: 'none',
          }}
        >
          {children}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`min-w-[${minWidth}]`}
        style={{ width: Width, height: Height }}
      >
        <DropdownMenuGroup>
          {dropdownItems &&
            dropdownItems.map((item: any, index: number) => (
              <DropdownMenuItem
                key={index}
                className="bg-transparent underline-offset-4 hover:cursor-pointer hover:underline hover:decoration-2 "
                onClick={() => {
                  onItemSelected(isDemo ? item.text : item.text.value, item.id && item.id);
                }}
              >
                {isDemo ? (
                  <Typography variant="l1">{item.text}</Typography>
                ) : (
                  <>
                    {item.href && item?.href?.toString().includes('https') ? (
                      <SitecoreLink field={item.href}>
                        <Typography variant="l1">
                          <ScText field={item.text} />
                        </Typography>
                      </SitecoreLink>
                    ) : (
                      <Typography variant="l1">
                        <ScText field={item.text} />
                      </Typography>
                    )}
                  </>
                )}
              </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// const DropDown = ({ dropdownItems }: DropDownProps) => {
//   return (
//     <div className="absolute bg-white p-[15px] mt-[17px] whitespace-nowrap">
//       {dropdownItems.map((item: any, index: number) => (
//         // cta button
//         <SitecoreLink key={index} field={item.href}>
//           <Typography
//             variant="l1"
//             extraStyles="leading-[25px] hover:decoration-2 hover:underline underline-offset-4"
//           >
//             <ScText field={item.text} />
//           </Typography>
//         </SitecoreLink>
//       ))}
//     </div>
//   );
// };

// export default DropDown;
