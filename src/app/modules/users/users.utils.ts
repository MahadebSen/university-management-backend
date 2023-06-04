import { userModel } from './users.model'

export const findLastUserId = async () => {
  const lastUser = await userModel
    .findOne({}, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean()

  return lastUser?.id
}

export const generateUserId = async () => {
  const currentId = (await findLastUserId()) || (0).toString().padStart(5, '0') // 00000
  // increment ID by 1
  const incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0') // 0+1 --> 1 --> 00001
  return incrementedId
}
