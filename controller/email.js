const { verifyToken } = require('../jwt');

const emailData = [
	{
		user: "niyaz",
		subject:"netflix - watch new movies"
	},
	{
		user: "niyaz",
		subject:"youtube - watch new movies"
	},
	{
		user: "niyaz",
		subject:"instagram"
	},
	{
		user: "narendra",
		subject:"amazon - order"
	},
	{
		user: "narendra",
		subject:"facebook - like"
	},
	{
		user: "kiran",
		subject:"prepbyte - classroom"
	},
	{
		user: "kiran",
		subject:"zoom - recording"
	}
];

function getEmail(req, res) {
	console.log('req.headers ', req.headers);

    const token = req.headers.token;
	const userData = verifyToken(token);
	// checking if userData is null, meaning token was invalid
	if (userData == null) {
		return res.status(400).send("token is incorrect");
	}

	const userName = userData.name;
	console.log("all data - ", emailData.length);
    const userEmail = [];
    for (eachEmail of emailData) {
        if (eachEmail.user == userName) {
            userEmail.push(eachEmail);
        }
    }

	console.log("user email data - ", userEmail.length);

    return res.json(userEmail);
}

module.exports = {
    getEmail,
}