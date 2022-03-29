
interface RequestOptions {
  language?: string
}

/** OTP Sending type */
export type OTPMethod = 'sms' | 'ivr' | 'messenger'

/**
 * OTP Status types
 * 'pending': OTP not yet sent
 * 'operatorDelivered': OTP sent to operator and waiting for delivery
 * 'sent': User recieved OTP
 * 'seen': OTP is seen by user (in messenger mode)
 * 'notDelivered': OTP not delivered by operator
 * 'failed': OTP failed to be delivered to operator
 */
export type OTPStatus = 'pending' | 'sent' | 'seen' | 'operatorDelivered' | 'notDelivered' | 'failed'

export enum MessengerProvider {
  /** from WhatsApp Messenger */
  WhatsApp = 1,
  /** from Gap Messenger (https://gap.im) */
  Gap = 2
}

export interface OTPError {
  code: number
  message: string
}

export interface SendInputCommon {
  templateID?: number
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
  provider?: number
  templateID?: number
}

/** @ignore */
export interface OTPSendResponse {
  referenceID: string
}

export interface VerifyRequest {
  /** The user mobile number country code */
  countryCode?: number
  /** The user mobile number */
  mobile: string
  /** The code that user entered */
  otp: string
}

export interface OTPStatusRequest {
  OTPReferenceID:	string
}

export interface OTPStatusResponse {
  /** OTP Send method (sms, ivr, ...) */
  OTPMethod: OTPMethod
  /** OTP status text (pending, sent, ...) */
  OTPStatus: OTPStatus
  /** Is OTP verified */
  OTPVerified: boolean
}
