import { useState, useCallback } from 'react';
import { addDays } from 'date-fns';
import { useI18n } from 'next-localization';
import { SitecoreLanguageToSabreLanguageMapping } from '@/utilities/LanguageUtilities';
import { SabreForm } from '@/utilities/SsoConstant';

/**
 *
 * @param param0
 * @returns
 */
export const useUrlForBookingRooms = ({
  selectedHotelId,
  defaultRoomCategory,
}: {
  selectedHotelId?: string | number;
  defaultRoomCategory?: string | number;
}) => {
  const { locale } = useI18n();

  const [adultNum, setAdultNum] = useState(1);
  const [childrenNum, setChildrenNum] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [selectedRoomCategory, setSelectedRoomCategory] = useState<string>(
    typeof defaultRoomCategory === 'string' ? defaultRoomCategory : ''
  );

  const [selectedArrive, setSelectedArrive] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDepart, setSelectedDepart] = useState(
    addDays(new Date(), 1).toISOString().split('T')[0]
  );
  let url = `https://reservations.easthotels.com/?adult=${adultNum}&arrive=${selectedArrive}&child=${childrenNum}&depart=${selectedDepart}&locale=${SitecoreLanguageToSabreLanguageMapping[locale()]}`;

  if (promoCode) {
    url += `&promo=${promoCode}`;
  }

  if (selectedHotelId) {
    url += `&hotel=${selectedHotelId}`;
  }

  if (selectedRoomCategory) {
    url += `&roomcategory=${selectedRoomCategory}`;
  }

  if (process.env.SABRE_MODE === 'uat') {
    url = url.replace('https://reservations.easthotels.com/', SabreForm.URL);
    url = url.replace(`&hotel=${selectedHotelId}`, `&hotel=${SabreForm.TEST_HOTEL_ID}`);
  }

  const resetAll = useCallback(() => {
    setAdultNum(1);
    setChildrenNum(0);
    setPromoCode('');
    setSelectedRoomCategory(typeof defaultRoomCategory === 'string' ? defaultRoomCategory : '');
    setSelectedArrive(new Date().toISOString().split('T')[0]);
    setSelectedDepart(addDays(new Date(), 1).toISOString().split('T')[0]);
  }, [defaultRoomCategory]);

  return {
    url: url,
    adultNum,
    setAdultNum,
    childrenNum,
    setChildrenNum,
    promoCode,
    setPromoCode,
    selectedArrive,
    setSelectedArrive,
    selectedDepart,
    setSelectedDepart,
    selectedRoomCategory,
    setSelectedRoomCategory,
    resetAll,
  };
};
