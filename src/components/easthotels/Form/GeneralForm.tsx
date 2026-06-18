import React, { useEffect, useState } from 'react';
import InputField from 'components/easthotels/Form/FormFields/InputField';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import TextAreaField from './FormFields/TextAreaField';
import SelectField from './FormFields/SelectField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { GeneralFormProps } from '@/props/Form/GeneralFormProps';
import LoadingButton from '../CustomTypes/Components/LoadingButton';
import Typography from '../Typography/Typography';
import {
  GetServerSideComponentProps,
  LayoutServicePageState,
  useComponentProps,
  useSitecoreContext,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { Text as ScText, RichText as ScRichText } from '@sitecore-jss/sitecore-jss-nextjs';
import { Element, scroller } from 'react-scroll';
import RichTextTypography from '../Typography/RichTextTypography';
import {
  FormKeyValueConfigurationsProps,
  KeyValueConfiguration,
} from '@/props/Graphql/FormKVConfigurationProps';
import { GetFormKVConfigurationService } from '@/graphql/FormKVConfiguration.service';
import { useSelectedInquiryType } from '@/hooks/useSelectedInquiryType';
import { SitecoreLanguageToCaptchaLanguageMapping } from '@/utilities/LanguageUtilities';
import { useDispatch, useSelector } from 'react-redux';
import { setAliyunCaptchaLoadedState } from 'lib/redux/features/scriptLoadStatus';
import captchaLogoImg from 'src/images/1x1.png';

type FormConfigurationServerProps = {
  titleConfiguration: FormKeyValueConfigurationsProps;
  inquiryConfiguration: FormKeyValueConfigurationsProps;
};

const Default = (generalFormProps: GeneralFormProps) => {
  let captcha;

  const getInstance = (instance) => {
    captcha = instance;
  };

  const sceneId = process.env.CAPTCHA_SCENE_ID;
  const prefixId = process.env.CAPTCHA_PREFIX_ID;
  const { t, locale } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [isCaptchaSuccess, setIsCaptchaSuccess] = useState(false);
  const [formStateType, setFormStateType] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(true);

  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;

  const inquiryType = useSelectedInquiryType();
  const isFormSelected = inquiryType === generalFormProps.rendering.dataSource;
  const hideForm = !isPageEditing && !isFormSelected;

  const formConfigurationServerProps = generalFormProps.rendering.uid
    ? useComponentProps<FormConfigurationServerProps>(generalFormProps.rendering.uid)
    : undefined;

  const generalFormSchema = z.object({
    generalFormInquiryType: z.string().min(1, {
      message: t(DICTIONARY_CONSTANT.FORMS.ERRORS.INVALID_INQUIRY_TYPE),
    }),
    title: z.string().refine((title: string) => title !== 'default', {
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
    areaCode: z.string(),
    contactNumber: z.string(),
    message: z.string().min(1, {
      message: t(DICTIONARY_CONSTANT.FORMS.ERRORS.MISSING_MESSAGE),
    }),
    language: z.string(),
    emailConfigurationId: z.string(),
  });

  const generalForm = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      inquiryType: 'general',
      generalFormInquiryType: 'hotel',
      title: 'default',
      firstName: '',
      lastName: '',
      email: '',
      areaCode: '',
      contactNumber: '',
      message: '',
      language: locale(),
      emailConfigurationId: generalFormProps.rendering.dataSource,
    },
  });

  const onSubmit = (values: z.infer<typeof generalFormSchema>) => {
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
          console.log(data);
          setFormStateType('success');
          setIsLoading(false);
          scroller.scrollTo('topOfSection-contactForms', {
            duration: 1000,
            smooth: true,
            offset: -200,
          });
        });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setFormStateType('error');
    }
  };

  const TITLE_OPTIONS = [
    { key: t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.TITLE), value: 'default' },
  ];

  formConfigurationServerProps?.titleConfiguration &&
    formConfigurationServerProps.titleConfiguration?.item?.children.results.map(
      (item: KeyValueConfiguration) => {
        TITLE_OPTIONS.push({ key: item.key.value, value: item.value.value });
      }
    );

  const GENERAL_FORM_INQUIRY_TYPE = [];
  formConfigurationServerProps?.inquiryConfiguration &&
    formConfigurationServerProps.inquiryConfiguration?.item?.children.results.map(
      (item: KeyValueConfiguration) => {
        GENERAL_FORM_INQUIRY_TYPE.push({ key: item.key.value, value: item.value.value });
      }
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
      //Hide captcha and submit directly (new: below line will cause error when change form after verifying captcha)
      // document.getElementById(`generalform-captcha-b`)?.remove();
      setIsCaptchaSuccess(true);
    } else {
      //Show error message
      console.log(`Invalid captcha. Please retry`);
    }
  };

  const { aliyunCaptchaLoaded } = useSelector((state: any) => state.scriptLoadStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFormSelected) {
      if (aliyunCaptchaLoaded) {
        setShowCaptcha(true);
        const initCaptcha = () => {
          window.initAliyunCaptcha({
            SceneId: sceneId, // 场景ID。根据步骤二新建验证场景后，您可以在验证码场景列表，获取该场景的场景ID
            prefix: prefixId, // 身份标。开通阿里云验证码2.0后，您可以在控制台概览页面的实例基本信息卡片区域，获取身份标
            mode: 'embed', // 验证码模式。popup表示要集成的验证码模式为弹出式。无需修改
            element: `#generalform-captcha-element`, // 页面上预留的渲染验证码的元素，与原代码中预留的页面元素保持一致。
            button: `#generalform-captcha-button`, // 触发验证码弹窗的元素。button表示单击登录按钮后，触发captchaVerifyCallback函数。您可以根据实际使用的元素修改element的值
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
          setShowCaptcha(true);
        };
      }
    } else {
      setShowCaptcha(false);
      document.getElementById('aliyunCaptcha-mask')?.remove();
      document.getElementById('aliyunCaptcha-window-popup')?.remove();
    }

    return () => {
      // 必须删除相关元素，否则再次mount多次调用 initAliyunCaptcha 会导致多次回调 captchaVerifyCallback
      document.getElementById('aliyunCaptcha-mask')?.remove();
      document.getElementById('aliyunCaptcha-window-popup')?.remove();
    };
  }, [isFormSelected, aliyunCaptchaLoaded]);

  // if (!isPageEditing && !isFormSelected) {
  //   return null;
  // }

  return (
    <div>
      {(isPageEditing || !formStateType) &&
        (generalFormProps.fields.Title.value ||
          generalFormProps.fields.Description.value ||
          generalFormProps.fields.Content.value) &&
        isFormSelected && (
          <div className="mt-[50px] max-w-[600px] space-y-8 lg:mx-0">
            <Typography variant="p">
              <ScText field={generalFormProps.fields.Title} />
            </Typography>
            <Typography variant="p">
              <ScText field={generalFormProps.fields.Description} />
            </Typography>
            <RichTextTypography>
              <ScRichText field={generalFormProps.fields.Content} />
            </RichTextTypography>
          </div>
        )}

      {(isPageEditing || formStateType == 'success') && isFormSelected && (
        <div className="mt-[50px] max-w-[600px] lg:mx-0">
          <RichTextTypography>
            <ScRichText field={generalFormProps.fields.SuccessMessage} />
          </RichTextTypography>
        </div>
      )}

      {(isPageEditing || formStateType == 'error') && isFormSelected && (
        <div className="mt-[50px] max-w-[600px] lg:mx-0">
          <RichTextTypography>
            <ScRichText field={generalFormProps.fields.ErrorMessage} />
          </RichTextTypography>
        </div>
      )}

      {!formStateType && (
        <Form {...generalForm}>
          <form
            onSubmit={generalForm.handleSubmit(onSubmit)}
            className={
              (hideForm ? 'form-hidden' : '') + ' mt-[50px] max-w-[600px] space-y-8 lg:mx-0'
            }
          >
            <>
              <div className="flex flex-row gap-[20px]">
                <div className="w-full">
                  <SelectField
                    control={generalForm.control}
                    name="generalFormInquiryType"
                    label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.INQUIRY_TYPE)}
                    placeholder={t(DICTIONARY_CONSTANT.FORMS.FIELD_PLACEHOLDERS.INQUIRY_TYPE)}
                    options={GENERAL_FORM_INQUIRY_TYPE}
                    required={true}
                  />
                </div>
                <div className="w-full">
                  <SelectField
                    control={generalForm.control}
                    name="title"
                    label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.TITLE)}
                    placeholder={t(DICTIONARY_CONSTANT.FORMS.FIELD_PLACEHOLDERS.TITLE)}
                    options={TITLE_OPTIONS}
                    required={true}
                  />
                </div>
              </div>

              <div className="flex flex-row gap-[20px]">
                <InputField
                  control={generalForm.control}
                  name="firstName"
                  label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.FIRST_NAME)}
                  required={true}
                />
                <InputField
                  control={generalForm.control}
                  name="lastName"
                  label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.LAST_NAME)}
                  required={true}
                />
              </div>

              <InputField
                control={generalForm.control}
                name="email"
                label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.EMAIL_ADDRESS)}
                placeholder={t(DICTIONARY_CONSTANT.FORMS.FIELD_PLACEHOLDERS.EMAIL_ADDRESS)}
                required={true}
              />
              <div className="flex flex-row gap-[20px]">
                <InputField
                  control={generalForm.control}
                  name="areaCode"
                  placeholder={t(DICTIONARY_CONSTANT.FORMS.FIELD_PLACEHOLDERS.AREA_CODE)}
                  label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.AREA_CODE)}
                  required={false}
                />

                <InputField
                  control={generalForm.control}
                  name="contactNumber"
                  label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.CONTACT_NUMBER)}
                  required={false}
                />
              </div>

              <TextAreaField
                control={generalForm.control}
                name="message"
                label={t(DICTIONARY_CONSTANT.FORMS.FIELD_LABELS.MESSAGE)}
                placeholder={t(DICTIONARY_CONSTANT.FORMS.FIELD_PLACEHOLDERS.MESSAGE)}
                required
              ></TextAreaField>

              {showCaptcha && (
                <div
                  id={'generalform-captcha-b'}
                  style={{
                    display: isCaptchaSuccess ? 'none' : 'block',
                  }}
                >
                  {/* TODO This captcha button is required for captcha to work. But it has nothing to do with the user. Need to use css styling to hide it */}
                  <div id={'generalform-captcha-button'} className="invisible">
                    点击弹出验证码B
                  </div>
                  <div id={'generalform-captcha-element'}></div>
                </div>
              )}

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
  );
};

export default withDatasourceCheck()<GeneralFormProps>(Default);

export const getServerSideProps: GetServerSideComponentProps = async (rendering, layoutData) => {
  const developmentFormProps = rendering as GeneralFormProps;

  var formTitleConfiguration = await GetFormKVConfigurationService(
    developmentFormProps.fields.TitleConfiguration.id,
    layoutData?.sitecore?.context?.language!
  );
  var formInquiryConfiguration = await GetFormKVConfigurationService(
    developmentFormProps.fields.InquiryConfiguration.id,
    layoutData?.sitecore?.context?.language!
  );

  const result: FormConfigurationServerProps = {
    titleConfiguration: formTitleConfiguration,
    inquiryConfiguration: formInquiryConfiguration,
  };

  return result;
};
