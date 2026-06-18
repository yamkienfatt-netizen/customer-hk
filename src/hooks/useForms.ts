import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { any, z } from 'zod';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';

const useForms = (type: string, dataSource: string | undefined) => {
  const { t, locale } = useI18n();


  return { };
};

export default useForms;
