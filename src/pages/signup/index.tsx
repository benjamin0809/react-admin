import React, { useState, useEffect, Fragment } from 'react'
import { Link, useRequest, history, useDispatch, getDvaApp } from 'umi'
import { Store } from 'antd/es/form/interface'
import LockOutlined from '@ant-design/icons/LockOutlined'
import { t } from '@lingui/macro'
// import UserLayout from '@/layouts/user-layout';
// import { fakeRegister, fetchCaptcha } from '@/services/login';
// import LoginForm from '../login/components';
import { GlobalFooter } from '@/components'
import GlobalHeader from '@/components/GlobalHeader'
import styles from './style.less'
import { HeaderProps, Link as LinkProps } from '@/interfaces/Common'
import { setLocale } from '@/utils'
import config from '@/utils/config'
import {
  Form,
  Input,
  InputNumber,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  Popover,
  Progress,
  message,
} from 'antd'
import { fetchCaptcha, login } from '@/services/login'

const FormItem = Form.Item
const { Option } = Select
const { Group } = Input
// const { Captcha } = LoginForm;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <span>强度：强</span>
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <span>强度：中</span>
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <span>强度：太短</span>
    </div>
  ),
}

let headerLinks: LinkProps[] = []
if (config.i18n) {
  headerLinks = headerLinks.concat(
    config.i18n.languages.map((item: any) => ({
      key: item.key,
      title: <span onClick={setLocale.bind(null, item.key)}>{item.title}</span>,
    }))
  )
}

const passwordProgressMap: {
  ok: 'success'
  pass: 'normal'
  poor: 'exception'
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
}

const SignUp: React.FC = () => {
  const dispatch = useDispatch()
  const [countdown, setCountdown] = useState<number>(0)
  const [captchastr, setCaptchastr] = useState<string>('Get captcha')
  const [mobile, setMobile] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(false)
  const [prefix, setPrefix] = useState<string>('86')
  const [popover, setPopover] = useState<boolean>(false)
  const confirmDirty = false
  const [form] = Form.useForm()

  /**
   * 倒计时副作用
   */
  useEffect(() => {
    if (countdown > 0) {
      setCaptchastr(`${countdown} 秒后再试`)
      const f = () => {
        setTimeout(() => {
          if (countdown > 0) {
            setCountdown(countdown - 1)
          }
        }, 1000)
      }
      f()
    } else {
      setCaptchastr('Get captcha')
    }
  }, [countdown])

  useEffect(() => {

  }, [])
  const getCaptcha = async () => {
    // dispatch({type: 'signup/getCaptcha', payload: {
    //   useTpye: 1,
    //   phone: '15014491899'
    // }})
    const value = form.getFieldValue('r_mobile')
    const data = await fetchCaptcha(value,1)
    setCountdown(60) 
  } 

   
  const getSendSmsBtnStatus = () => {
    const value = form.getFieldValue('r_mobile')
    if (value && value.length > 11) {
      return true
    }
    return false
  }
  const getPasswordStatus = () => {
    const value = form.getFieldValue('password')
    if (value && value.length > 9) {
      return 'ok'
    }
    if (value && value.length > 5) {
      return 'pass'
    }
    return 'poor'
  }

  //   const handleCaptcha = async () => {
  //     const { mobile } = await form.validateFields(['mobile']);

  //     if (mobile) {
  //       const result = await fetchCaptcha(mobile);
  //       if (result?.code === 200) {
  //         return true;
  //       }
  //     }

  //     return false;
  //   }

  //   const { loading: submitting, run: register } = useRequest<{ data: any }>(fakeRegister, {
  //     manual: true,
  //     onSuccess: (data, params) => {
  //       if (data.status === 'ok') {
  //         message.success('注册成功！');
  //         history.push({
  //           pathname: '/user/register-result',
  //           state: {
  //             account: params.email,
  //           },
  //         });
  //       }
  //     },
  //   });
  //   const onFinish = (values: Store) => {
  //     register(values);
  //   };

  const checkConfirm = (_: any, value: string) => {
    const promise = Promise
    if (value && value !== form.getFieldValue('r_password')) {
      return promise.reject('两次输入的密码不匹配!')
    }
    return promise.resolve()
  }

  const checkPassword = (_: any, value: string) => {
    const promise = Promise
    // 没有值的情况
    if (!value) {
      setVisible(!!value)
      return promise.reject('请输入密码!')
    }
    // 有值的情况
    if (!visible) {
      setVisible(!!value)
    }
    setPopover(!popover)
    if (value.length < 6) {
      return promise.reject('')
    }
    if (value && confirmDirty) {
      form.validateFields(['confirm'])
    }
    return promise.resolve()
  }

  const changePrefix = (value: string) => {
    setPrefix(value)
  }

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password')
    const passwordStatus = getPasswordStatus()
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null
  }

  const onFinish = (e: any) => {
    console.log(e)
    
    // sendVerifyCode()
  } 
  const onMobileChange = () => {
    const value = form.getFieldValue('r_mobile') 
    setMobile(value || '')
  }
  const sendVerifyCode = async (mobile: string) => {
    // const data = await fetchCaptcha(mobile, 1)
    const data = await login()
    console.log(data)
  }

  useEffect(() => {
    const data = {
      clientId: '1',
      roleCode: 'ADMINISTRATOR',
      username: 'administrator',
      password: '12345699',
    }
    // sendVerifyCode('15014491899')
    // const dispatch = getDvaApp()._store.dispatch

    // dispatch({ type: 'signup/signUp', payload: {
    //   phone: '15014491899',
    //   useType: 1
    // } })
    // dispatch({ type: 'login/login', payload: data })
  }, [])

  return (
    <Fragment>
      <GlobalHeader links={headerLinks} />
      <div className={styles.main}>
        <div className={styles.form}>
          <h1 className={styles.title}>{t`Sign Up Hints`}</h1>
          <Form
            form={form}  
            name="signup"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }} 
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label={t`Mobile_Label`}
              name="r_mobile"
              validateTrigger='onBlur'
              rules={[
                { required: true, message: t`Mobile Hints` },
                {
                  pattern: /^\d{11}$/,
                  message: t`Mobile Illegal`,
                },
              ]}
            >
              <Input onChange={onMobileChange}/>
            </Form.Item>
            <Form.Item
              label={t`Verify_Code_Label`} 
              required={true}
            >
              <Row gutter={8}>
                <Col flex="1">
                  <Form.Item
                    name="r_captcha"
                    noStyle
                    rules={[
                      { required: true, message: t`Verify Code Required` },
                    ]}
                  >
                    <Input placeholder="请输入6位数字验证码" />
                  </Form.Item>
                </Col>
                <Col flex="100px">
                  <Button disabled={countdown > 0 || mobile.length < 11} onClick={getCaptcha}>{captchastr}</Button>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item
              label={t`Password_Label`}
              name="r_password"
              extra={t`Password_Regular`}
              rules={[{ required: true, message: t`Password Hints` }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label={t`Password_Review_Label`}
              name="r_password2"
              rules={[{ required: true, message: t`Password Hints Review` },
                {
                  validator: checkConfirm,
                },]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label={t`Email_Label`}
              name="r_email"
              rules={[{ required: true, message: t`Email Hints` }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          {/* <Form form={form} name="register" onFinish={onFinish}>
            <Group compact>
              <Select
                size="large"
                value={prefix}
                onChange={changePrefix}
                style={{ width: '20%' }}
              >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
              </Select>
              <FormItem
                style={{ width: '80%' }}
                name="mobile"
                rules={[
                  {
                    required: true,
                    message: '请输入手机号!',
                  },
                  {
                    pattern: /^\d{11}$/,
                    message: '手机号格式错误!',
                  },
                ]}
              >
                <Input size="large" maxLength={11} placeholder="手机号" />
              </FormItem>
            </Group>
            { <Captcha
            name="captcha"
            placeholder="验证码"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
            onCaptcha={handleCaptcha}
          /> }
            <Popover
              getPopupContainer={(node) => {
                if (node && node.parentNode) {
                  return node.parentNode as HTMLElement
                }
                return node
              }}
              content={
                visible && (
                  <div style={{ padding: '4px 0' }}>
                    {passwordStatusMap[getPasswordStatus()]}
                    {renderPasswordProgress()}
                    <div style={{ marginTop: 10 }}>
                      <span>
                        请至少输入 6 个字符。请不要使用容易被猜到的密码。
                      </span>
                    </div>
                  </div>
                )
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={visible}
            >
              <FormItem
                name="password"
                className={
                  form.getFieldValue('password')?.length > 0 && styles.password
                }
                rules={[
                  {
                    validator: checkPassword,
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<LockOutlined className={styles.prefixIcon} />}
                  type="password"
                  placeholder="至少6位密码，区分大小写"
                />
              </FormItem>
            </Popover>
            <FormItem
              name="confirm"
              rules={[
                {
                  required: true,
                  message: '确认密码',
                },
                {
                  validator: checkConfirm,
                },
              ]}
            >
              <Input
                size="large"
                prefix={<LockOutlined className={styles.prefixIcon} />}
                type="password"
                placeholder="确认密码"
              />
            </FormItem>
            <FormItem>
              <Button
                size="large"
                //   loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                注册
              </Button>
              <Link className={styles.login} to="/login">
                <span>使用已有账户登录</span>
              </Link>
            </FormItem>
          </Form> */}
        </div>
      </div>
      <div className={styles.footer}>
        <GlobalFooter copyright={config.copyright} slogon={config.slogon} />
      </div>
    </Fragment>
  )
}
export default SignUp
