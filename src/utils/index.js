import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const SECRET = 'edteam'

export const getUserId = request => {
  const header = request.get('authorization')

  if (header) {
    const token = header.replace('Bearer ', '')
    const { id } = jwt.verify(token, SECRET)

    return id
  }

  throw new Error('Authentication required')
}

export const hashPassword = async password => {
  if (password.length < 6)
    throw new Error('Password debería ser mayor a 5 carácteres.')

  const salt = await bcrypt.genSalt(10)

  return bcrypt.hash(password, salt)
}

export const validatePassword = async (input, password) =>
  await bcrypt.compare(input, password)

export const generateToken = async id =>
  jwt.sign({ id }, SECRET, { expiresIn: '2 days' })
