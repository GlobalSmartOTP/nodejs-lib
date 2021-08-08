// @ts-check
require('dotenv').config()
const { GsOTP, isGsOTPError } = require('../dist/index')

const mobile = process.env.TEST_PHONE_NUMBER
const apiKey = process.env.API_KEY

const otp = new GsOTP(apiKey, false)

test('send otp and get its status', () => {
  return otp.sendSMS({
    mobile,
    length: 4,
    templateID: 12,
    param1: 'foo'
  })
  .then(result => {
    console.log(result)
    expect(typeof result).toBe('bigint')
    return otp.getStatus({ OTPReferenceID: result })
  })
  .then(result => {
    console.log(result)
  })
})

test('get otp status', () => {
  return otp.getStatus({ OTPReferenceID: 1628160593121007556n })
    .then(result => {
      console.log(result)
    })
})

test('verify otp', () => {
  return otp.verify({
    mobile,
    otp: '1111',
  })
    .then(result => {
      console.log(result)
    })
    .catch(error => {
      expect(isGsOTPError(error)).toBe(true)
    })
})

test('Is otp error', () => {
  expect(isGsOTPError({ code: 10321, message: 'OK' })).toBe(true)
})
