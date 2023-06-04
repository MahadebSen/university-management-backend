import config from '../../../config/index'
import { IUser } from './users.interface'
import { userModel } from './users.model'
import { generateUserId } from './users.utils'

const createUser = async (payload: IUser): Promise<IUser | null> => {
  // auto generated incremental Id
  const id = await generateUserId()
  payload.id = id

  // Default password
  if (!payload.password) {
    payload.password = config.default_user_pass as string
  }

  // Create user using model
  const createdUser = await userModel.create(payload)

  if (!createdUser) {
    throw new Error('Failed to create user!')
  } else {
    return createdUser
  }
}

export default {
  createUser,
}
