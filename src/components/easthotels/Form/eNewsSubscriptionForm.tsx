import {
  RichText as ScRichText,
  GetServerSideComponentProps,
  useComponentProps,
  LayoutServicePageState,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import React, { useCallback, useEffect, useMemo, useState, JSX } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import InputField from 'components/easthotels/Form/FormFields/InputField';
import Typography from 'components/easthotels/Typography/Typography';
import SelectField from 'components/easthotels/Form/FormFields/SelectField';
import RadioGroupField from 'components/easthotels/Form/FormFields/RadioGroupField';
import CheckboxField from 'components/easthotels/Form/FormFields/CheckboxField';
import CheckboxGroupField from 'components/easthotels/Form/FormFields/CheckboxGroupField';
import { SubscriptionFormProps } from '@/props/Form/SubscriptionFormProps';
import { GetFormKVConfigurationService } from '@/graphql/FormKVConfiguration.service';
import {
  FormKeyValueConfigurationsProps,
  KeyValueConfiguration,
} from '@/props/Graphql/FormKVConfigurationProps';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { useSearchParams } from 'next/navigation';
import RichTextTypography from '../Typography/RichTextTypography';
import { SitecoreLanguageToCaptchaLanguageMapping } from '@/utilities/LanguageUtilities';
import { useDispatch, useSelector } from 'react-redux';
import { setAliyunCaptchaLoadedState } from 'lib/redux/features/scriptLoadStatus';
import { FormLocations } from '@/utilities/FormUtilities';
import SpinnerIcon from 'components/ui/spinner-icon';
import captchaLogoImg from 'src/images/1x1.png';

function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let previous = 0;
  let result: ReturnType<T>;

  const later = (context: any, args: any[]) => {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
  };

  return function (this: any, ...args: any[]) {
    const now = Date.now();
    if (!previous && options.leading === false) {
      previous = now;
    }
    const remaining = wait - (now - previous);
    const context = this;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(() => {
        later(context, args);
      }, remaining);
    }
    return result;
  };
}

async function submitSubscriptionWebservice<T>(payload: T): Promise<boolean> {
  try {
    //TODO validation
    const response = await fetch('/api/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (response.status.toString() === '200') {
      const data = await response.json();
      // console.log('Webservice data:', data);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('submitSubscriptionWebservice error:', error);
    return false;
  }
}

type FormConfigurationServerProps = {
  titleConfiguration: FormKeyValueConfigurationsProps;
  hotelPropertiesConfiguration: FormKeyValueConfigurationsProps;
};

export const Default = (subscriptionFormProps: SubscriptionFormProps): JSX.Element => {
  let captcha;

  // const { aliyunCaptchaLoaded } = useSelector(getScriptLoadStatusState);
  const { aliyunCaptchaLoaded } = useSelector((state: any) => state.scriptLoadStatus);
  const dispatch = useDispatch();

  const getInstance = (instance) => {
    captcha = instance;
  };

  const sceneId = process.env.CAPTCHA_SCENE_ID;
  const prefixId = process.env.CAPTCHA_PREFIX_ID;

  const [formStateType, setFormStateType] = useState('');
  const [isCaptchaSuccess, setIsCaptchaSuccess] = useState(false);
  const searchParams = useSearchParams();
  const rawSubscriptionEmail = searchParams.get('email') || '';
  const subscriptionEmail = rawSubscriptionEmail.replace(/\/+$/, '');
  const { sitecoreContext } = useSitecoreContext();
  const { t, locale } = useI18n();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z
    .object({
      title: z.string().min(1, {
        message: t(DICTIONARY_CONSTANT.FORMS.ERRORS.MISSING_TITLE),
      }),
      firstName: z.string().min(1, {
        message: t(DICTIONARY_CONSTANT.FORMS.ERRORS.MISSING_FIRST_NAME),
      }),
      lastName: z.string().min(1, {
        message: t(DICTIONARY_CONSTANT.FORMS.ERRORS.MISSING_LAST_NAME),
      }),
      email: z.string().email({
        message: t(DICTIONARY_CONSTANT.FORMS.ERRORS.INVALID_EMAIL_ADDRESS),
      }),
      confirmEmail: z.string().email({
        message: t(DICTIONARY_CONSTANT.FORMS.ERRORS.INVALID_EMAIL_ADDRESS),
      }),
      captcha: z.string().min(1, {
        message: t(DICTIONARY_CONSTANT.FORMS.ERRORS.INVALID_CAPTCHA),
      }),
      stayedInThePast: z.enum(['Yes', 'No'], {
        required_error: t(DICTIONARY_CONSTANT.FORMS.ERRORS.MISSING_OPTION),
      }),
      residenceLocation: z.string().default(''),
      consent: z
        .boolean()
        .default(false)
        .refine((value) => value === true, {
          message: t(DICTIONARY_CONSTANT.FORMS.ERRORS.REQUIRE_CONFIRM),
        }),
      sensitiveInfoConsent: z.boolean().default(false),
      mainlandRecipientsConsent: z.boolean().default(false),
      outsideRecipientsConsent: z.boolean().default(false),
      marketingMaterialsConsent: z
        .boolean()
        .default(false)
        .refine((value) => value === true, {
          message: t(DICTIONARY_CONSTANT.FORMS.ERRORS.REQUIRE_CONFIRM),
        }),
      stayedHotels: z.array(z.string()),
      propertyCode: z.string(),
    })
    .superRefine((data, ctx) => {
      if (data.confirmEmail !== data.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t(DICTIONARY_CONSTANT.FORMS.ERRORS.EMAIL_NOT_MATCH),
          path: ['confirmEmail'],
        });
      }

      if (
        data.stayedInThePast === t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.YES) &&
        data.stayedHotels.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t(DICTIONARY_CONSTANT.FORMS.ERRORS.MISSING_LOCATION),
          path: ['stayedHotels'],
        });
      }
    })
    .transform((data) => {
      return {
        ...data,
        stayedHotels:
          data.stayedInThePast === t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.YES)
            ? data.stayedHotels
            : [],
      };
    });

  const formConfigurationServerProps = subscriptionFormProps.rendering.uid
    ? useComponentProps<FormConfigurationServerProps>(subscriptionFormProps.rendering.uid)
    : undefined;
  const formResidenceLocationsData = FormLocations[locale()].map((item: any) => {
    return { key: item.value, value: item.key };
  });
  const formTitlesData =
    formConfigurationServerProps?.titleConfiguration &&
    formConfigurationServerProps.titleConfiguration?.item?.children.results.map(
      (item: KeyValueConfiguration) => {
        return { key: item.key.value, value: item.value.value };
      }
    );
  const formHotelPropertiesData =
    formConfigurationServerProps?.hotelPropertiesConfiguration &&
    formConfigurationServerProps.hotelPropertiesConfiguration?.item?.children.results.map(
      (item: KeyValueConfiguration) => {
        return { key: item.key.value, value: item.value.value };
      }
    );

  const stayBeforeOptions = [
    { key: 'Yes', value: t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.YES) },
    { key: 'No', value: t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.NO) },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      firstName: '',
      lastName: '',
      email: subscriptionEmail!,
      confirmEmail: '',
      captcha: '1',
      stayedInThePast: 'No',
      residenceLocation: '',
      consent: false,
      sensitiveInfoConsent: false,
      mainlandRecipientsConsent: false,
      outsideRecipientsConsent: false,
      marketingMaterialsConsent: false,
      stayedHotels: [],
      propertyCode: subscriptionFormProps.fields.CreatedLocation?.fields.Value.value! as string,
    },
  });

  const submitForm = useCallback(async (formPayload: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    console.log('submitForm invoked at:', new Date().toLocaleTimeString(), formPayload);
    try {
      const success = await submitSubscriptionWebservice(formPayload);
      setFormStateType(success ? 'success' : 'error');
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStateType('error');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const onSubmit = useMemo(
    () => throttle(submitForm, 10000, { leading: true, trailing: false }),
    [submitForm]
  );

  const captchaVerifyCallback = async (captchaVerifyParam: any) => {
    console.log(`captchaVerifyCallback: ${captchaVerifyParam}`);
    var payload = {
      captchaVerifyParam: captchaVerifyParam,
    };

    const captchaResp = await fetch('/api/captcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (captchaResp.status.toString() === '200') {
      const captchaRespJson = await captchaResp.json();
      return {
        captchaResult: captchaRespJson.captchaVerifyResult,
      };
    } else {
      return {
        captchaResult: false,
      };
    }
  };
  // 验证通过后调用
  const onBizResultCallback = (resp: Boolean) => {
    console.log('onBizResultCallback', resp);
    // Resp either true or false
    if (resp) {
      //Hide captcha and submit directly
      document.getElementById('subscription-captcha-b')?.remove();
      setIsCaptchaSuccess(true);
    } else {
      //Show error message
    }
  };

  const consent = form.watch('consent');
  const sensitiveInfoConsent = form.watch('sensitiveInfoConsent');
  const mainlandRecipientsConsent = form.watch('mainlandRecipientsConsent');
  const outsideRecipientsConsent = form.watch('outsideRecipientsConsent');
  const [consentChanged, setConsentChanged] = useState(false);

  useEffect(() => {
    if (aliyunCaptchaLoaded) {
      const initCaptcha = () => {
        window.initAliyunCaptcha({
          SceneId: sceneId, // 场景ID。根据步骤二新建验证场景后，您可以在验证码场景列表，获取该场景的场景ID
          prefix: prefixId, // 身份标。开通阿里云验证码2.0后，您可以在控制台概览页面的实例基本信息卡片区域，获取身份标
          mode: 'embed', // 验证码模式。popup表示要集成的验证码模式为弹出式。无需修改
          element: '#subscription-captcha-element', // 页面上预留的渲染验证码的元素，与原代码中预留的页面元素保持一致。
          button: '#subscription-captcha-button', // 触发验证码弹窗的元素。button表示单击登录按钮后，触发captchaVerifyCallback函数。您可以根据实际使用的元素修改element的值
          // captchaVerifyCallback: captchaVerifyCallback, // 业务请求(带验证码校验)回调函数，无需修改
          // onBizResultCallback: onBizResultCallback, // 业务请求结果回调函数，无需修改
          success: async (captchaVerifyParam: string) => {
            const result = await captchaVerifyCallback(captchaVerifyParam);
            if (!result?.captchaResult) {
              initCaptcha();
            }
            onBizResultCallback(!!result?.captchaResult);
            return !!result?.captchaResult;
          },
          fail: (error: any) => {
            console.log(error);
          },
          getInstance: getInstance, // 绑定验证码实例函数，无需修改
          slideStyle: {
            width: 360,
            height: 40,
          }, // 滑块验证码样式，支持自定义宽度和高度，单位为px。其中，width最小值为320 px
          language: SitecoreLanguageToCaptchaLanguageMapping[locale()], // 验证码语言类型，支持简体中文（cn）、繁体中文（tw）、英文（en）
          immediate: true, // 完成验证后，是否立即发送验证请求（调用captchaVerifyCallback函数）
          captchaLogoImg: captchaLogoImg.src,
        });
      };
      initCaptcha();
      return;
    } else {
      const script = document.createElement('script');
      script.id = 'aliyun-captcha';
      script.src = 'https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js';
      document.body.appendChild(script);
      script.onload = () => {
        dispatch(setAliyunCaptchaLoadedState(true));
      };
    }
    return () => {
      // 必须删除相关元素，否则再次mount多次调用 initAliyunCaptcha 会导致多次回调 captchaVerifyCallback
      document.getElementById('aliyunCaptcha-mask')?.remove();
      document.getElementById('aliyunCaptcha-window-popup')?.remove();
    };
  }, [aliyunCaptchaLoaded]);

  useEffect(() => {
    if (consent) {
      form.setValue('sensitiveInfoConsent', true);
      form.setValue('mainlandRecipientsConsent', true);
      form.setValue('outsideRecipientsConsent', true);
    } else {
      form.setValue('sensitiveInfoConsent', false);
      form.setValue('mainlandRecipientsConsent', false);
      form.setValue('outsideRecipientsConsent', false);
    }
  }, [consent]);

  useEffect(() => {
    const updateConsent = () => {
      if (sensitiveInfoConsent && mainlandRecipientsConsent && outsideRecipientsConsent) {
        form.setValue('consent', true);
      } else {
        form.setValue('consent', false);
      }
    };

    updateConsent();
  }, [sensitiveInfoConsent, mainlandRecipientsConsent, outsideRecipientsConsent, form]);

  const sitecoreCss = subscriptionFormProps.params?.Styles ?? '';
  const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;

  return (
    <div
      className={
        'small-section-container  pb-[80px]  lg:max-w-[600px] lg:pb-[120px] ' + sitecoreCss
      }
    >
      {(isPageEditing || formStateType === 'success') && (
        <div className="text-center">
          <RichTextTypography>
            <ScRichText field={subscriptionFormProps.fields.SuccessMessage} />
          </RichTextTypography>
        </div>
      )}

      {(isPageEditing || formStateType === 'error') && (
        <div className="text-center">
          <RichTextTypography>
            <ScRichText field={subscriptionFormProps.fields.ErrorMessage} />
          </RichTextTypography>
        </div>
      )}

      {!formStateType && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mx-[15px] space-y-8">
            {(isPageEditing || formStateType === 'success') && (
              <RichTextTypography>
                <ScRichText field={subscriptionFormProps.fields.SuccessMessage} />
              </RichTextTypography>
            )}

            {(isPageEditing || formStateType === 'error') && (
              <RichTextTypography>
                <ScRichText field={subscriptionFormProps.fields.ErrorMessage} />
              </RichTextTypography>
            )}

            <div className="flex flex-col gap-[20px] lg:flex-row">
              <SelectField
                control={form.control}
                name="title"
                label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.TITLE)}
                placeholder={t(DICTIONARY_CONSTANT.FORMS.FIELD_PLACEHOLDERS.TITLE)}
                options={formTitlesData}
                required={true}
              />
              <div className="flex flex-row gap-[20px]">
                <InputField
                  control={form.control}
                  name="firstName"
                  label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.FIRST_NAME)}
                  required={true}
                />
                <InputField
                  control={form.control}
                  name="lastName"
                  label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.LAST_NAME)}
                  required={true}
                />
              </div>
            </div>

            <InputField
              control={form.control}
              name="email"
              label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.EMAIL_ADDRESS)}
              placeholder={t(DICTIONARY_CONSTANT.FORMS.FIELD_PLACEHOLDERS.EMAIL_ADDRESS)}
              required={true}
            />

            <InputField
              control={form.control}
              name="confirmEmail"
              label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.CONFIRM_EMAIL)}
              placeholder={t(DICTIONARY_CONSTANT.FORMS.FIELD_PLACEHOLDERS.EMAIL_ADDRESS)}
              required={true}
            />
            <SelectField
              control={form.control}
              name="residenceLocation"
              label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.RESIDENCE_LOCATION)}
              placeholder={t(DICTIONARY_CONSTANT.FORMS.FIELD_PLACEHOLDERS.RESIDENCE_LOCATION)}
              options={formResidenceLocationsData}
              required={true}
            />
            <RadioGroupField
              control={form.control}
              name="stayedInThePast"
              label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.STAYED_BEFORE)}
              options={stayBeforeOptions}
            />
            {form.watch('stayedInThePast') === 'Yes' && (
              <CheckboxGroupField
                control={form.control}
                name="stayedHotels"
                options={formHotelPropertiesData}
              />
            )}
            <CheckboxField
              control={form.control}
              name="consent"
              label={<ScRichText field={subscriptionFormProps.fields.PrivacyPolicyConsent} />}
              onParentChange={() => {
                setConsentChanged(!consentChanged);
              }}
            />
            <div className="ml-[20px] grid grid-rows-3 gap-[15px]">
              <CheckboxField
                control={form.control}
                name="sensitiveInfoConsent"
                label={<ScRichText field={subscriptionFormProps.fields.SensitiveInfoConsent} />}
              />
              <CheckboxField
                control={form.control}
                name="mainlandRecipientsConsent"
                label={
                  <ScRichText field={subscriptionFormProps.fields.DataManageWithinResidence} />
                }
              />
              <CheckboxField
                control={form.control}
                name="outsideRecipientsConsent"
                label={
                  <ScRichText field={subscriptionFormProps.fields.DataManageOutsideResidence} />
                }
              />
            </div>
            <CheckboxField
              control={form.control}
              name="marketingMaterialsConsent"
              label={<ScRichText field={subscriptionFormProps.fields.MarketingOptinConsent} />}
            />

            <div id="subscription-captcha-b">
              <div id="subscription-captcha-button" className="invisible">
                点击弹出验证码B
              </div>
              <div id="subscription-captcha-element"></div>
            </div>

            <Button
              className="my-[50px] w-full items-center justify-center bg-green-primary py-[17px]"
              disabled={isSubmitting || !isCaptchaSuccess}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <SpinnerIcon />
                </div>
              ) : (
                <Typography variant="l1" fontColor="white" fontWeight="bold">
                  {t(DICTIONARY_CONSTANT.FORMS.ACTION_LABELS.SUBMIT)}
                </Typography>
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideComponentProps = async (rendering, layoutData) => {
  const subscriptionFormProps = rendering as SubscriptionFormProps;

  var formTitleConfiguration = await GetFormKVConfigurationService(
    subscriptionFormProps.fields.TitleConfiguration.id,
    layoutData?.sitecore?.context?.language!
  );
  // var residenceLocationConfiguration = await GetFormKVConfigurationService(
  //   subscriptionFormProps.fields.ResidenceLocationConfiguration.id,
  //   layoutData?.sitecore?.context?.language!
  // );
  var hotelPropertiesConfiguration = await GetFormKVConfigurationService(
    subscriptionFormProps.fields.HotelPropertiesConfiguration.id,
    layoutData?.sitecore?.context?.language!
  );

  const result: FormConfigurationServerProps = {
    titleConfiguration: formTitleConfiguration,
    hotelPropertiesConfiguration: hotelPropertiesConfiguration,
  };

  return result;
};
