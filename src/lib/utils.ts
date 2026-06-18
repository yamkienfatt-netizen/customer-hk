import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const scrollToElement = (element: HTMLElement, offset = 0) => {
  if (!element) return;
  if (typeof window === 'undefined') return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.scrollY + offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
};

// export const getAccordionItemNameForScroller = (index: number | string) => {
//   return `accordion-item-${index}`;
// }
export const getAccordionItemNameForScroller = (id: number | string) => {
  return `accordion-item-${id}`;
};
