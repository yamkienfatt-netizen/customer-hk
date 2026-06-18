import React, { useEffect, useState, JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import RichTextTypography from '../Typography/RichTextTypography';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { zodResolver } from '@hookform/resolvers/zod';
import { useI18n } from 'next-localization';
import { z } from 'zod';
import InputField from './FormFields/InputField';
import TextAreaField from './FormFields/TextAreaField';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import SelectField from './FormFields/SelectField';
import Typography from '../Typography/Typography';
import { Button } from '@/components/ui/button';
import { Element, scroller } from 'react-scroll';
import {
  withDatasourceCheck,
  Placeholder as ScPlaceholder,
  GetServerSideComponentProps,
  useComponentProps,
  Text as ScText,
  RichText as ScRichText,
  useSitecoreContext,
  LayoutServicePageState,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { HotelPickupFormProps } from '@/props/Form/HotelPickupFormProps';
import {
  FormKeyValueConfigurationsProps,
  KeyValueConfiguration,
} from '@/props/Graphql/FormKVConfigurationProps';
import { GetFormKVConfigurationService } from '@/graphql/FormKVConfiguration.service';
import LoadingButton from '../CustomTypes/Components/LoadingButton';
import { SitecoreLanguageToCaptchaLanguageMapping } from '@/utilities/LanguageUtilities';
import { useDispatch, useSelector } from 'react-redux';
import { setAliyunCaptchaLoadedState } from 'lib/redux/features/scriptLoadStatus';
import captchaLogoImg from 'src/images/1x1.png';

type FormConfigurationServerProps = {
  titleConfiguration: FormKeyValueConfigurationsProps;
};

const Default = (hotelPickupFormProps: HotelPickupFormProps): JSX.Element => {
  let captcha;

  const getInstance = (instance) => {
    captcha = instance;
  };

  const sceneId = process.env.CAPTCHA_SCENE_ID;
  const prefixId = process.env.CAPTCHA_PREFIX_ID;

  const [isLoading, setIsLoading] = useState(false);
  const [formStateType, setFormStateType] = useState('');
  const [isCaptchaSuccess, setIsCaptchaSuccess] = useState(false);
  const sitecoreCss = hotelPickupFormProps.params?.Styles ?? '';
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;

  const { t, locale } = useI18n();
  const formConfigurationServerProps = hotelPickupFormProps.rendering.uid
    ? useComponentProps<FormConfigurationServerProps>(hotelPickupFormProps.rendering.uid)
    : undefined;

  const TITLE_OPTIONS = [
    { key: t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.TITLE), value: 'default' },
  ];

  formConfigurationServerProps?.titleConfiguration &&
    formConfigurationServerProps.titleConfiguration?.item?.children.results.map(
      (item: KeyValueConfiguration) => {
        TITLE_OPTIONS.push({ key: item.key.value, value: item.value.value });
      }
    );

  const formSchema = z.object({
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
    contactNumber: z.string(),
    bookingRef: z.string().min(1, {
      message: t(DICTIONARY_CONSTANT.FORMS.ERRORS.MISSING_BOOKING_REF),
    }),
    flightTrainNo: z.string(),
    note: z.string().min(1, {
      message: t(DICTIONARY_CONSTANT.FORMS.ERRORS.MISSING_MESSAGE),
    }),
    language: z.string(),
    emailConfigurationId: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      bookingRef: '',
      flightTrainNo: '',
      note: '',
      language: locale(),
      emailConfigurationId: hotelPickupFormProps.rendering.dataSource,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      // Do something with the form values.
      console.log(values);
      fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('SUCCESS', data);
          setFormStateType('success');
          setIsLoading(false);
          scroller.scrollTo('topOfSection', {
            duration: 1000,
            smooth: true,
            offset: -100,
          });
        });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setFormStateType('error');
    }
  }

  const hotelPickupFormPlaceholderKey = `hotelpickupform`;

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
      document.getElementById('captcha-b')?.remove();
      setIsCaptchaSuccess(true);
    } else {
      //Show error message
      console.log(`Invalid captcha. Please retry`);
    }
  };

  const { aliyunCaptchaLoaded } = useSelector((state: any) => state.scriptLoadStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (aliyunCaptchaLoaded) {
      const initCaptcha = () => {
        window.initAliyunCaptcha({
          SceneId: sceneId, // 场景ID。根据步骤二新建验证场景后，您可以在验证码场景列表，获取该场景的场景ID
          prefix: prefixId, // 身份标。开通阿里云验证码2.0后，您可以在控制台概览页面的实例基本信息卡片区域，获取身份标
          mode: 'embed', // 验证码模式。popup表示要集成的验证码模式为弹出式。无需修改
          element: '#captcha-element', // 页面上预留的渲染验证码的元素，与原代码中预留的页面元素保持一致。
          button: '#captcha-button', // 触发验证码弹窗的元素。button表示单击登录按钮后，触发captchaVerifyCallback函数。您可以根据实际使用的元素修改element的值
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

  return (
    <>
      <div
        className={
          'lg:small-section-container mx-[15px] lg:mx-auto lg:max-w-[600px] ' + sitecoreCss
        }
      >
        <Element name={'topOfSection'}></Element>

        <ScPlaceholder
          name={hotelPickupFormPlaceholderKey}
          rendering={hotelPickupFormProps.rendering}
        />

        {(isPageEditing || formStateType == 'success') && (
          <div className="mt-[100px] max-w-[600px] space-y-4 pb-8 lg:mx-0 ">
            <RichTextTypography>
              <ScRichText field={hotelPickupFormProps.fields.SuccessMessage} />
            </RichTextTypography>
          </div>
        )}

        {(isPageEditing || formStateType == 'error') && (
          <div className="mt-[100px] max-w-[600px] space-y-4 pb-8 lg:mx-0 ">
            <RichTextTypography>
              <ScRichText field={hotelPickupFormProps.fields.ErrorMessage} />
            </RichTextTypography>
          </div>
        )}

        {!formStateType && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-[100px] max-w-[600px] space-y-4 pb-8 lg:mx-0"
            >
              <>
                <div className="flex flex-col gap-[20px] lg:flex-row">
                  <SelectField
                    control={form.control}
                    name="title"
                    label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.TITLE)}
                    placeholder={t(DICTIONARY_CONSTANT.FORMS.FIELD_PLACEHOLDERS.TITLE)}
                    options={TITLE_OPTIONS}
                    required={true}
                  />
                  <div className="flex flex-row gap-[20px]">
                    <InputField
                      control={form.control}
                      name="firstName"
                      label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.FIRST_NAME)}
                      required
                    />
                    <InputField
                      control={form.control}
                      name="lastName"
                      label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.LAST_NAME)}
                      required
                    />
                  </div>
                </div>

                <InputField
                  control={form.control}
                  name="email"
                  label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.EMAIL_ADDRESS)}
                  placeholder={t(DICTIONARY_CONSTANT.FORMS.FIELD_PLACEHOLDERS.EMAIL_ADDRESS)}
                  required
                />

                <InputField
                  control={form.control}
                  name="contactNumber"
                  label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.CONTACT_NUMBER)}
                />

                <InputField
                  control={form.control}
                  name="bookingRef"
                  label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.HOTEL_BOOKING_REFERENCE)}
                  required
                />
                <InputField
                  control={form.control}
                  name="flightTrainNo"
                  label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.FLIGHT_TRAIN_REFERENCE)}
                />
                <TextAreaField
                  control={form.control}
                  name="note"
                  label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.NOTE)}
                  placeholder=""
                ></TextAreaField>

                <div id="captcha-b">
                  {/* TODO This captcha button is required for captcha to work. But it has nothing to do with the user. Need to use css styling to hide it */}
                  <div id="captcha-button" className="invisible">
                    点击弹出验证码B
                  </div>
                  <div id="captcha-element"></div>
                </div>

                <LoadingButton loading={isLoading} type="submit" isDisabled={!isCaptchaSuccess}>
                  <Typography variant="l1" fontColor={'white'} fontWeight="bold">
                    {t(DICTIONARY_CONSTANT.FORMS.ACTION_LABELS.SUBMIT)}
                  </Typography>
                </LoadingButton>
              </>
            </form>
          </Form>
        )}
      </div>
    </>
  );
};

export default withDatasourceCheck()<HotelPickupFormProps>(Default);

export const getServerSideProps: GetServerSideComponentProps = async (rendering, layoutData) => {
  const hotelPickupFormProps = rendering as HotelPickupFormProps;

  var formTitleConfiguration = await GetFormKVConfigurationService(
    hotelPickupFormProps.fields.TitleConfiguration.id,
    layoutData?.sitecore?.context?.language!
  );
  const result: FormConfigurationServerProps = {
    titleConfiguration: formTitleConfiguration,
  };

  return result;
};
