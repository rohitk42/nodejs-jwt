const Router = require('express').Router;
const userRouter = Router();

const { signupFunc, loginFunc, refreshToken, forgetPassword, resetPassword } = require('../controller/user')

userRouter.post('/signup', signupFunc);
userRouter.post('/login', loginFunc);
userRouter.get('/refresh', refreshToken);
userRouter.post('/forgetPassword', forgetPassword);
userRouter.put('/resetPassword', resetPassword);

module.exports = {
    userRouter
};
