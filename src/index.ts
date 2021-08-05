import got from 'got'
import { SendInput, SendManualyInput, SendAutomaticInput, OTPSendResponse, VerifyRequest, OTPStatusRequest, OTPStatusResponse, OTPSendRequest } from './types'
export { SendInput, SendManualyInput, SendAutomaticInput, OTPSendResponse, VerifyRequest, OTPStatusRequest, OTPStatusResponse, OTPSendRequest }
export { OTPMethod, OTPStatus } from './types'

const GSOTP_HOST = 'https://api.gsotp.com'

export class GsOTP<IsManual extends boolean = false> {
  /**
   * @param apiKey Your API key in gsOTP.com.
   * @param manual Generate OTP code automatically or you gonna to enter it manually. <br>Default is `false`.
   * @param language Target language for error messages.
   */
  constructor(
    private readonly apiKey: string,
    manual: IsManual = false as IsManual,
    private readonly language = 'fa-IR') {
      this.sendSMS = this.sendSMS.bind(this)
      this.sendIVR = this.sendIVR.bind(this)
      this.sendGapMessage = this.sendGapMessage.bind(this)
      this.verify = this.verify.bind(this)
      this.getStatus = this.getStatus.bind(this)
  }
  
  private request<T>(path: string, body: object): Promise<T> {
    let language = this.language

    if ('language' in body) {
      language = (body as any).language
      delete (body as any).language
    }

    return got(GSOTP_HOST + path, {
      headers: {
        'accept-language': language,
        'content-type': 'application/json',
        apiKey: this.apiKey
      },
      method: 'post',
      responseType: 'text',
      body: stringify(body),
    })
      .then(response => {
        const result = parse(response.body) as unknown as T & { status?: any, error?: any }
        if (result.error) {
          return Promise.reject(result)
        }
        delete result.status
        delete result.error
        return result as T
      })
  }

  private send(method: OTPSendRequest['method'], options: SendInput<IsManual>): Promise<bigint> {
    const body: OTPSendRequest = {
      method,
      countryCode: options.countryCode,
      mobile: options.mobile,
      smart: false, // not implemented in core.gsotp.com yet!
      param1: options.param1,
      param2: options.param2,
      param3: options.param3,
      expireTime: options.expireTime ? +options.expireTime : undefined,
      templateID: options.templateID,
      code: (options as SendManualyInput).code,
      length: (options as SendAutomaticInput).length,
    }

    return this.request<OTPSendResponse>('/otp/send', body)
      .then(result => result.referenceID)
  }
  /**
   * Send OTP Code via SMS
   * @param options Send options
   * @returns Reference ID
   */
  sendSMS(options: SendInput<IsManual>): Promise<bigint> {
    return this.send('sms', options)
  }
  /**
   * Send OTP Code via IVR (Interactive voice response)
   * @param options Send options
   * @returns Reference ID
   */
  sendIVR(options: SendInput<IsManual>): Promise<bigint> {
    return this.send('ivr', options)
  }
  /**
   * Send OTP Code via Gap Messenger ([gap.im](https://gap.im))
   * @returns Reference ID
   */
  sendGapMessage(options: SendInput<IsManual>): Promise<bigint> {
    return this.send('gap', options)
  }

  /**
   * Verify the user entered code.
   * @returns If the code is correct the promise resolves.
   */
  verify(options: VerifyRequest): Promise<void> {
    const body: VerifyRequest = {
      countryCode: options.countryCode,
      mobile: options.mobile,
      otp: options.otp,
    }
    return this.request<void>('/otp/verify', body)
  }

  /**
   * Get status of the sent OTP.
   * @param referenceID
   */
  getStatus(options: OTPStatusRequest): Promise<OTPStatusResponse> {
    const body: OTPStatusRequest = {
      OTPReferenceID: options.OTPReferenceID,
    }
    return this.request<OTPStatusResponse>('/otp/status', body)
  }
}

function stringifyReplacer(key: string, value: any) {
  return (typeof value === 'bigint') ? `BigInt(${String(value)})` : value
}
function stringify(object: any) {
  let string = JSON.stringify(object, stringifyReplacer)
  string = string.replace(/"BigInt\((\d+)\)"/g, '$1')
  return string
}

function jsonParseReviver(key: string, value: any) {
  if (typeof value === 'string' && /^BigInt\(\d+\)$/.test(value)) {
    return BigInt(value.match(/\d+/)![0])
  }
  return value
}
function parse(string: any) {
  string = string.replace(/\:\s*(\d{15}\d+)\s*([,}])/g, ':"BigInt($1)"$2')
  return JSON.parse(string, jsonParseReviver)
}
