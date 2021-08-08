import got from 'got'
import { parse, stringify } from './jsonBigInt'
import { SendInput, SendManualyInput, SendAutomaticInput, OTPSendResponse, VerifyRequest, OTPStatusRequest, OTPStatusResponse, OTPSendRequest, OTPError } from './types'
export { SendInput, SendManualyInput, SendAutomaticInput, OTPSendResponse, VerifyRequest, OTPStatusRequest, OTPStatusResponse, OTPSendRequest, OTPError }
export { OTPMethod, OTPStatus } from './types'

const GSOTP_HOST = 'https://api.gsotp.com'

/**
 * Check whether an error is a gsOTP standard error or not<br>
 * These objects has two fields: `code` and `message`
 * @param error The error object to check
 * @returns `error` is a standard gsOTP error
 */
export function isGsOTPError(error: any): error is OTPError {
  return !!(error && error.code && error.message && error.constructor === Object)
}

export class GsOTP<IsManual extends boolean = false> {
  /**
   * @param apiKey Your API key in gsOTP.com.
   * @param manual Generate OTP code automatically or you gonna to enter it manually. <br>Default is `false`.
   * @param language Target language for showing error messages.
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
      .catch((error: any) => {
        if (error.status === 'error' && isGsOTPError(error.error)) {
          Promise.reject(error.error)
        }
        return Promise.reject(error)
      })
  }

  private send(method: OTPSendRequest['method'], options: SendInput<IsManual>): Promise<bigint> { 
    const body = {
      method,
      smart: false, // not implemented in core.gsotp.com yet!
      ...options,
      expireTime: options.expireTime ? +options.expireTime : undefined,
    } as OTPSendRequest

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
    return this.request<void>('/otp/verify', options)
      .then(() => {})
  }

  /**
   * Get status of the sent OTP.
   * @param referenceID
   */
  getStatus(options: OTPStatusRequest): Promise<OTPStatusResponse> {
    return this.request<OTPStatusResponse>('/otp/status', options)
  }
}
