import { RequestHandler } from 'express'
import { UserService } from './user.service'

const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { user } = await req.body
    const result = await UserService.createUser(user)

    res.status(200).json({
      success: true,
      message: 'Successfully created user!',
      data: result,
    })
  } catch (error) {
    // res.status(400).json({
    //   sucess: false,
    //   message: 'Failed to create user',
    //   data: error,
    // })
    next(error)
  }
}

export const UserController = {
  createUser,
}
