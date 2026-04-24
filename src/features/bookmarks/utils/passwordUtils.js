export const generatePassword = (length = 16, options = {}) => {
  const upper   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower   = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  let chars = lower + upper + numbers
  if (options.special) chars += special

  let password = ''
  const arr = new Uint32Array(length)
  crypto.getRandomValues(arr)
  for (let i = 0; i < length; i++) {
    password += chars[arr[i] % chars.length]
  }
  return password
}

export const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: 'None', color: '#5a5f7a' }

  let score = 0
  if (pwd.length >= 8)          score++
  if (pwd.length >= 12)         score++
  if (/[A-Z]/.test(pwd))        score++
  if (/[0-9]/.test(pwd))        score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  const levels = [
    { score: 0, label: 'None',      color: '#5a5f7a' },
    { score: 1, label: 'Weak',      color: '#ff4d6a' },
    { score: 2, label: 'Fair',      color: '#ff9500' },
    { score: 3, label: 'Good',      color: '#ffcc00' },
    { score: 4, label: 'Strong',    color: '#00e5a0' },
    { score: 5, label: 'Excellent', color: '#00e5a0' },
  ]
  return levels[score]
}
