
interface RequestOptions {
  language?: string
}

export type OTPMethod = 'sms' | 'ivr' | 'email' | 'gap'
export type OTPStatus = 'pending' | 'sent' | 'deliver' | 'failed'

interface GsOtpError {}

export interface SendInputCommon {
  templateID: number
  countryCode?: number
  mobile: string
  param1?: string
  param2?: string
  param3?: string
  expireTime?: Date
}

export interface SendManualyInput extends SendInputCommon {
  code: string
}

export interface SendAutomaticInput extends SendInputCommon {
  length: number
}

export type SendInput<IsManual extends boolean> = IsManual extends true ? SendManualyInput : SendAutomaticInput

/** @ignore */
 export interface OTPSendRequest {
  code: string
  countryCode?: number
  expireTime?: number
  length: number
  method: OTPMethod,
  mobile: string
  param1?: string
  param2?: string
  param3?: string
  smart: boolean
  templateID: number
}

/** @ignore */
export interface OTPSendResponse {
  referenceID: bigint
}

export interface VerifyRequest {
  countryCode?: number
  mobile: string
  otp: string
}

export interface OTPStatusRequest {
  OTPReferenceID:	bigint
}

export interface OTPStatusResponse {
  /** OTP Send method (sms, ivr, ...) */
  OTPMethod: OTPMethod
  /** OTP status text (pending, sent, ...) */
  OTPStatus: OTPStatus
  /** Is OTP verified */
  OTPVerified: boolean
}
