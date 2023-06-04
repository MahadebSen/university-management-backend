import { Request, Response } from 'express'
import usersService from './users.service'

const createUser = async (req: Request, res: Response) => {
  try {
    const { user } = await req.body
    const result = await usersService.createUser(user)

    res.status(200).json({
      success: true,
      message: 'Successfully created user!',
      data: result,
    })
  } catch (error) {
    res.status(400).json({
      sucess: false,
      message: 'Failed to create user',
      data: error,
    })
  }
}

export default {
  createUser,
}
