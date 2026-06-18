import { SabreForm } from '@/utilities/SsoConstant';
import { useEffect, useState } from 'react';

const getChainIdByHotel = (hotel: string | number | undefined) => {
  const chainIds = process.env.SABRE_SHG_CHAIN_ID_MAP!;
  if (hotel && chainIds?.length) {
    const parts = chainIds.split('|');
    for (let index = 0; index < parts.length; index++) {
      const element = parts[index];
      const [_hotel, chanid] = element.split('~');
      if (_hotel == hotel) {
        return chanid;
      }
    }
  }

  return SabreForm.SHG_CHAIN_ID;
};

const useSabreSession = () => {
  const [sabreSession, SetSabreSession] = useState('');
  const doSabreLogin = (
    bookNowUrl: string,
    hotel: string | number | undefined,
    target = '_blank'
  ) => {
    let sabreActionUrl = bookNowUrl.replace('https://reservations.easthotels.com/', SabreForm.URL);
    let hasLoading = false;
    if (typeof document !== 'undefined') {
      const createHiddenField = (name: string, value: string): HTMLInputElement => {
        const chainField = document.createElement('input');
        chainField.type = 'hidden';
        chainField.name = name;
        chainField.value = value;
        return chainField;
      };
      const showLoadingMask = () => {
        const exists = document.getElementById('loading-state');
        if (!exists) {
          const div = document.createElement('div');
          div.id = 'loading-state';
          const inner = document.createElement('div');
          inner.id = 'loading';
          div.appendChild(inner);
          document.body.appendChild(div);
          hasLoading = true;
        }
      };
      const hideLoadingMask = () => {
        if (hasLoading) {
          const div = document.getElementById('loading-state');
          if (div) {
            div.remove();
          }
          hasLoading = false;
        }
      };
      const doSabreFormPost = (sabreActionUrl: string, token: string) => {
        const form = document.createElement('form');
        const chainField = createHiddenField('chain', getChainIdByHotel(hotel));
        const sessionField = createHiddenField('session', token);
        const levelField = createHiddenField('level', 'hotel');
        form.appendChild(chainField);
        form.appendChild(sessionField);
        form.appendChild(levelField);
        if (hotel) {
          sabreActionUrl = sabreActionUrl.replace(`&hotel=${hotel}`, '');
          const hotelId = process.env.SABRE_MODE === 'uat' ? SabreForm.TEST_HOTEL_ID : hotel;
          let hotelField = createHiddenField('hotel', `${hotelId}`);
          form.appendChild(hotelField);
        }
        form.action = sabreActionUrl;
        form.target = target;
        form.method = 'post';
        document.body.append(form);
        form.submit();
        form.parentNode?.removeChild(form);
      };
      if (sabreSession) {
        doSabreFormPost(sabreActionUrl, sabreSession);
      } else {
        showLoadingMask();
        let fallback = true;
        fetch('/api/booking/sabreLogin')
          .then((reponse) => reponse.json())
          .then((data) => {
            if (data?.Token) {
              SetSabreSession(data?.Token);
              doSabreFormPost(sabreActionUrl, data?.Token);
              fallback = false;
            }
          })
          .finally(() => {
            hideLoadingMask();
            if (fallback) {
              if (target === '_self') {
                location.assign(bookNowUrl);
              } else {
                // window.open(bookNowUrl, target);
                window.location.href = bookNowUrl;
              }
            }
          });
      }
    }
  };
  return { doSabreLogin };
};
export default useSabreSession;
