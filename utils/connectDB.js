import mongoose from 'mongoose';

const connectBD = () => {
    if (mongoose.connections[0].readyState) {
        console.log('Already connect');
        return
    }
    mongoose.connect(process.env.MONGODB_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, error => {
        if (error) {
            throw error
        }
        console.log('Connect to mongodb.');
    })
}

export default connectBD
