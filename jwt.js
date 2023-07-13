const jwt = require('jsonwebtoken');

const secretKey = "asdkajsdiofaowejrlsdlfj";

function createToken(data, expiresIn) {
    const token = jwt.sign(data, secretKey, { expiresIn });
    return token;
}

// send userdata if token is valid
// otherwise send null if it invalid
function verifyToken(token) {
    try {
        const tokenData = jwt.verify(token, secretKey);
        return tokenData;
    } catch (err) {
        console.log(err);
        return null;
    }
}

module.exports = {
    createToken,
    verifyToken,
}


