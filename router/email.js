const Router = require('express').Router;
const emailRouter = Router();

const { getEmail } = require('../controller/email')

emailRouter.get('/fetch', getEmail);

module.exports = {
    emailRouter
};
