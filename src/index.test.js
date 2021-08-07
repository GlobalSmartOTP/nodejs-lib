// @ts-check
require('dotenv').config()
const { GsOTP } = require('../dist/index')
console.log(process.env.API_KEY)

const otp = new GsOTP(process.env.API_KEY, false)

test('send otp', done => {
  otp.sendSMS({
    mobile: '09333333333',
    length: 4,
    templateID: 12,
    param1: 'foo'
  })
  .then(result => {
    console.log(result)
    expect(typeof result).toBe('bigint')
    done()
  })
  .catch(done)
})

test('get otp status', () => {
  return otp.getStatus({ OTPReferenceID: 1628160593121007556n })
    .then(r => {
      console.log(r)
    })
})

test('verify otp', () => {
  return otp.verify({
    mobile: '09333333333',
    otp: '3305',
  })
    .then(r => {
      console.log(r)
    })
})
