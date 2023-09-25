import bcrypt from 'bcrypt'
export const verifyPassword = async ({ password, hashPassword }) => {
  const match = await bcrypt.compare(password, hashPassword)
  return match
}
