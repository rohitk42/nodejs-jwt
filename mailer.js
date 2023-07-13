const nodemailer = require('nodemailer');

async function sendMail(receiverEmail, subject, content) {
    try {
        // create a transporter
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '<PROVIDE_YOUR_EMAIL>',
                pass: '<PROVIDE_APP_PASSWORD_EMAIL>' // 2FA App password 
            }
        });

        const mailOptions = {
            from: '<PROVIDE_YOUR_EMAIL>',
            to: receiverEmail,
            subject,
            text: content,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        
    } catch (err) {
        console.log(err);
        return false;
    }

    return true;
}

module.exports = {
    sendMail,
}