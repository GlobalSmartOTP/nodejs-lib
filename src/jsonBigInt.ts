function stringifyReplacer(key: string, value: any) {
  return (typeof value === 'bigint') ? `BigInt(${String(value)})` : value
}
export function stringify(object: any) {
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
export function parse(string: any) {
  string = string.replace(/\:\s*(\d{15}\d+)\s*([,}])/g, ':"BigInt($1)"$2')
  return JSON.parse(string, jsonParseReviver)
}
