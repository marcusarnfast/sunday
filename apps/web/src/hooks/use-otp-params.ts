import { createLoader, parseAsString } from 'nuqs/server'
 
export const otpParams = {
  email: parseAsString,
}
 
export const loadOtpParams = createLoader(otpParams)