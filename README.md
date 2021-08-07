<p dir="rtl">بسم الله الرّحمن الرّحیم</p>

# [gsOTP.com](https://gsotp.com) Node.js SDK
## Documents
[Full documentation is here.](https://globalsmartotp.github.io/nodejs-lib)

## Install
```bash
npm install gsotp
```

## Send OTP Code
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
otp.verify({
  mobile: '09333333333',
  otp: '3305',
})
.then(() => {
  console.log('Code is correct!')
})
.catch(() => {
  console.log('Can not verify')
})
```
