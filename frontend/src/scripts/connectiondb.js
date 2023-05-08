import { MongoClient } from 'mongodb';
const url = 'mongodb://mongo:27017/products';

MongoClient.connect(url, function(err, client) {
    if (err) {
        console.log("Error in connection");
        throw err;


    }


    const db = client.db('products');
    console.log("Database created!");
    // perform database operations here
    client.close();
});