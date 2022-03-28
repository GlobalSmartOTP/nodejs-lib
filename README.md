<p dir="rtl">بسم الله الرّحمن الرّحیم</p>

# [gsOTP.com](https://gsotp.com) Node.js SDK
## Documents
[Full documentation is here.](https://globalsmartotp.github.io/nodejs-lib)

## Install
```bash
npm install gsotp
```

## Send OTP Code Via **WhatsApp Messenger**
```js
const { GsOTP } = require('gsotp')
const otp = new GsOTP(API_KEY)

otp.sendWhatsAppMessage({
  mobile: '09333333333',
  templateID: 12,
  param1: 'Foo',
  length: 4,
})
.then(referenceID => {
  console.log(referenceID)
})
.catch(error => {
  console.error(error)
})
```

## Send OTP Code Via **SMS**
```js
const { GsOTP } = require('gsotp')
const otp = new GsOTP(API_KEY)

otp.sendSMS({
  mobile: '09333333333',
  templateID: 12,
  param1: 'Foo',
  length: 4,
})
.then(referenceID => {
  console.log(referenceID)
})
.catch(error => {
  console.error(error)
})
```

## Verify OTP Code
```js
const { GsOTP, isGsOTPError } = require('gsotp')
const otp = new GsOTP(API_KEY)

otp.verify({
  mobile: '09333333333',
  otp: '3305',
})
.then(() => {
  console.log('Code is correct!')
})
.catch(error => {
  // handle Error
  if (isGsOTPError(error)) {
    console.log(`Error ${error.code}: ${error.message}`)
  } else {
    // unknown error
    console.error(error)
  }
})
```

## Use async functions
```js
async function send() {
  try {
    const result = await otp.getStatus({ OTPReferenceID: 1628960593121007556n })
    console.log('Method: ' + result.OTPMethod)
    console.log('Status: ' + result.OTPStatus)
    console.log('Verified: ' + result.OTPVerified)
  } catch (error) {
    if (isGsOTPError(error)) {
      console.log(`Error ${error.code}: ${error.message}`)
    } else {
      console.error(error)
    }
  }
}

send()
```
