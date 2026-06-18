import React, { useState, useEffect, JSX } from 'react';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { LocationContent } from '../AboutUs/LocationContent';
import { ContactUsFormProps } from '@/props/Form/ContactUsFormProps';
import {
  Placeholder as ScPlaceholder,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import SelectField from './FormFields/SelectField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { _Form } from '@/props/common/_Form';
import { Treelist } from '@/props/fields/ScField';
import { useDispatch, useSelector } from 'react-redux';
import { setContactUsFormInquiryTypeState } from 'lib/redux/features/contactUsForm';
import { Element, scroller } from 'react-scroll';

export const Default = (contactUsFormProps: ContactUsFormProps): JSX.Element => {
  const INQUIRY_TYPE_OPTIONS = contactUsFormProps.fields.SelectedForms.map(
    (form: Treelist<_Form>, index: number) => {
      return { key: form.fields.Title.value, value: form.id };
    }
  );

  const contactUsFormSchema = z.object({
    inquiryType: z.string(),
  });

  const contactUsForm = useForm<z.infer<typeof contactUsFormSchema>>({
    resolver: zodResolver(contactUsFormSchema),
    defaultValues: {
      inquiryType: INQUIRY_TYPE_OPTIONS[0]?.value,
    },
  });

  const dispatch = useDispatch();
  const sitecoreCss = contactUsFormProps.params?.Styles ?? '';

  const contactUsFormPlaceholderKey = `contactusform`;
  const { t } = useI18n();

  useEffect(() => {
    dispatch(setContactUsFormInquiryTypeState(INQUIRY_TYPE_OPTIONS[0]?.value));
  }, []);

  return (
    <>
      {/* <Element name={'topOfSection'}></Element> */}

      <div className={'small-section-container !lg:mx-0 !ml-0 !mr-[15px] ' + sitecoreCss}>
        <LocationContent {...contactUsFormProps} className={'!my-0'} />

        <Element name={'topOfSection-contactForms'}></Element>

        <Form {...contactUsForm}>
          <div className="w-[calc(50%-10px)]">
            <SelectField
              control={contactUsForm.control}
              name="inquiryType"
              label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.INQUIRY_TYPE)}
              placeholder={t(DICTIONARY_CONSTANT.FORMS.FIELD_PLACEHOLDERS.INQUIRY_TYPE)}
              options={INQUIRY_TYPE_OPTIONS}
              onValueChange={(value) => {
                dispatch(setContactUsFormInquiryTypeState(value));
              }}
              required={true}
            />
          </div>
        </Form>

        <ScPlaceholder
          name={contactUsFormPlaceholderKey}
          rendering={contactUsFormProps.rendering}
        />
      </div>
    </>
  );
};

export default withDatasourceCheck()<ContactUsFormProps>(Default);
