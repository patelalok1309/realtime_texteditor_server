import mongoose  from 'mongoose'

const dbConnect = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL)
        console.log("[CONNECTED_TO_DB]", connectionInstance.connection.host, connectionInstance.connection.name)
    } catch (error) {
        console.log("[ERROR_CONNECTING_TO_DB]", error)
        process.exit(1)
    }
}

export default dbConnect;