import crypto from 'crypto'

export const hashCode = (s: string): number =>
  s.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

/**
 * MD5
 *
 * @param data
 * @return string
 */
export const md5 = (data: string): string => {
  const md5sum = crypto.createHash('md5')
  md5sum.update(data)
  return md5sum.digest('hex')
}

/**
 * Base64
 *
 * @param data
 * @return string
 */
export const base64 = (data: string): string => {
  const b = Buffer.from(data)
  return b.toString('base64')
}
