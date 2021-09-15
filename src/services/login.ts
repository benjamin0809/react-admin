import request from '@/utils/request'; 

/**
 * 获取手机验证码
 * @param mobile
 */
export async function fetchCaptcha(mobile: string, useType: number) {
  return request({
    method: 'get',
    url: `/special/user/phone/sms/code`,
    data: {
        phone: mobile,
        useType,
        timestamp: Date.now()
    } 
    })
}

/**
 * 获取手机验证码
 * @param mobile
 */
 export async function login() {
  const data = {
    "clientId":"1",
    "roleCode":"ADMINISTRATOR",
    "username":"administrator",
    "password":"12345699"
  }
    return request({
      method: 'post',
      url: `/auth/tenant/user/login`,
      data: data
      })
  }
  
