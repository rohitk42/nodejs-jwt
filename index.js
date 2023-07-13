

const express = require('express');

const { emailRouter } = require('./router/email');
const { userRouter } = require('./router/user');

const app = express();
const PORT = process.env.PORT || 3000; // what is this ?

app.use(express.json());

app.use('/email', emailRouter);
app.use('/user', userRouter);


app.listen(PORT, () => {
    console.log(`server is running...${PORT}`);
});










