import mongoose from 'mongoose'

const connect = async () => {
    try{
        console.log("Attempting to connect to databse");
        await mongoose.connect(process.env.MONGO_URL,{});
        console.log("Connected to Database")
    } catch(e){
        console.log(e.message);
        process.exit(1);
    }
}


export default connect;