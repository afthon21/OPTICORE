import mongoose from 'mongoose';

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Conn to db'))
    .catch((error) => console.log(error))