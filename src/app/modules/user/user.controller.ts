import { RequestHandler } from 'express';
import { UserService } from './user.service';

const createUser: RequestHandler = async (req, res, next) => {
  try {
    // const createUserZodSchema = z.object({
    //   body: z.object({
    //     role: z.string({
    //       required_error: 'role is required',
    //     }),
    //     password: z.string().optional(),
    //   }),
    // })

    // await createUserZodSchema.parseAsync(req)

    const { user } = await req.body;
    const result = await UserService.createUser(user);

    res.status(200).json({
      success: true,
      message: 'Successfully created user!',
      data: result,
    });
  } catch (error) {
    // res.status(400).json({
    //   sucess: false,
    //   message: 'Failed to create user',
    //   data: error,
    // })
    // Globally handleing errors
    next(error);
  }
};

export const UserController = {
  createUser,
};
