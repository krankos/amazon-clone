import { MongoClient } from "mongodb";
console.log(
    import.meta.env.MONGODB_URI)
if (!
    import.meta.env.MONGODB_URI) {

    throw new Error('Invalid environment variable: "MONGODB_URI"');
}

const uri =
    import.meta.env.MONGODB_URI;
const options = {};
let cachedMongo;

const connectToDB = async() => {
    const mongo = await new MongoClient(uri, options).connect();
    //  DB name

    return mongo.db("amazon-store");
};

export const getDB = async() => {

    if (
        import.meta.env.NODE_ENV === "development") {
        if (!global._mongoConnection) {
            global._mongoConnection = await connectToDB();
            cachedMongo = global._mongoConnection;
        }
        return cachedMongo;
    }
    const mongo = await connectToDB();
    return mongo;
};

export const data = async() => {
    const db = await getDB();
    return db.collection("products");
};