const bcrypt = require('bcrypt');
const { createToken, verifyToken } = require('../jwt');
const { sendMail } = require('../mailer');

// used to store user information
const userData = [
];

function hashPassword(password) {
    const saltRound = 10;
    return bcrypt.hashSync(password, saltRound);
}

function checkPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

function signupFunc(req, res) {
    const userInfo = req.body;

    userInfo.password = hashPassword(userInfo.password);

    // hash the password
    userData.push(userInfo);

    console.log(userData);

    res.status(201).json({
        message: "user created succefully"
    });
}

function loginFunc(req, res) {
    const loginInfo = req.body;

    let userFound = null;
    for ( const eachUser of userData) {
        if (eachUser.email == loginInfo.email) {
            userFound = eachUser;
        }
    }

    if (userFound == null) {
        return res.status(400).send('user is not registered');
    }
    
    // compare hash and password
    const isPasswordCorrect = checkPassword(loginInfo.password, userFound.password);
    if (!isPasswordCorrect) {
        return res.status(400).send('password is not correct');
    }

    // during login we are create the token
    const loginToken = createToken(
        {
            name: userFound.name,
            email: userFound.email,
        }, 
        '30m'
    );

    const refreshToken = createToken(
        {
            // to differentiat between tokens
            isRefreshToken : true,
            name: userFound.name,
            email: userFound.email,
        }, 
        '2d'
    );
    
    
    return res.json({
       message: 'user loggedin',
       loginToken,
       refreshToken,
    });
}

function refreshToken(req, res) {
    const refreshtoken = req.headers.refresh_token;

    const userData = verifyToken(refreshtoken);
    
    console.log(userData);

    if (userData == null) {
        return res.status(400).send("please login again");
    } 

    if (!userData.isRefreshToken) {
        return res.status(400).send("please send refresh token only");
    }

    const loginToken = createToken(
        {
            name: userData.name,
            email: userData.email,
        }, 
        '30m'
    );

    return res.json({
        loginToken
    });
}

async function forgetPassword(req, res) {
    const userInfo = req.body;
    
    console.log('body -> ', userInfo);

    // find user for given email
    let userFound = null;
    for ( const eachUser of userData) {
        if (eachUser.email == userInfo.email) {
            userFound = eachUser;
        }
    }

    console.log('userFound -> ', userFound);

    // we say user doesn't exist
    if (userFound == null) {
        return res.status(400).send('user is not registered');
    }

    // create forget password token, it is for unique
    const forgetPasswordToken = createToken({
        isForgetPassword: true,
        email: userInfo.email,
    }, '1d');

    
    // sending mail
    const resetPasswordLink = `http://localhost:3000/user/resetPassword?token=${forgetPasswordToken}`

    const receiverEmail = userInfo.email;
    const subject =  "Please reset your password";
    const content = `please reset your password using this link - ${resetPasswordLink}`;
    
    const isMailSent = await sendMail(receiverEmail, subject, content);

    console.log(content);

    if (isMailSent == false) {
        return res.status(500).send('please try again! something is not correct');
    }

    return res.send('please check your registered email address for reset password link');
}

function resetPassword(req, res) {
    const newPassword = req.body.newPassword;
    const token = req.query.token;

    //verify the forget password token
    const tokenData = verifyToken(token);
    if (tokenData == null) {
        return res.status(400).send("please send correct token");
    }

    console.log(tokenData);

    // to make sure we are passing forget password token only
    if (!tokenData.isForgetPassword) {
        return res.status(400).send("please send correct forget-password token");
    }

    const forgetPasswordEmail = tokenData.email;

    // change the password this user of email
    const userIndex = userData.findIndex((eachUser) => {
        return eachUser.email == forgetPasswordEmail;
    })

    const newHashPassword = hashPassword(newPassword);
    
    userData[userIndex].password = newHashPassword;

    return res.send('password updated, please try login now');
}


module.exports = {
    signupFunc,
    loginFunc,
    refreshToken,
    forgetPassword,
    resetPassword
}
