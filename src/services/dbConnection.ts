import mongoose from "mongoose";
type connection = {
    isConnected?: any
}
const connection: connection = {};

async function dbConnection() {
    if (connection.isConnected) {
        return;
    }
    // const db = await mongoose.connection(process.env.MONGO_URI, {
    //     useNewUrlParser: true
    // });
    const db = await mongoose.connect(process.env.MONGO_URI);
    connection.isConnected = db.connections[0].readyState;
}

export default dbConnection;