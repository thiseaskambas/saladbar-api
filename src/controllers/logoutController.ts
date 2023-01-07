import { Response, Request, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { IUser } from '../tsTypes';
import User from '../models/userModel';

const logoutHandler = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    //NOTE: also delete accessToken on FRONT END !
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.status(204).json({ status: 'success' }); //No content 204
    }
    const refreshToken = cookies.jwt;
    const found: IUser | null = await User.findOne({ refreshToken });
    if (!found) {
      res.clearCookie('jwt', { httpOnly: true });
      return res
        .status(403)
        .json({ status: 'error', message: 'forbiden access' }); //403 forbiden
    }

    //Delete refreshToken from DB!
    const index = found.refreshToken.findIndex(refreshToken);
    found.refreshToken.splice(index);

    await found.save();
    res.clearCookie('jwt', { httpOnly: true });
    return res.status(200).json({ status: 'success' });
  }
);

export default { logoutHandler };
