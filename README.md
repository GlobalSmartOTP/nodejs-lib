<p dir="rtl">بسم الله الرّحمن الرّحیم</p>

# [gsOTP.com](gsOTP.com) Node.js SDK

## Simple usage example

### Send OTP Code
```js
const GsOTP = require('gsotp')
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

### Verify OTP Code
```js
otp.verify({
  mobile: '09333333333',
  otp: '3305',
})
```
