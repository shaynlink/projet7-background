const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI);

function initializeMongo(app) {
    client.connect().then(() => console.log('MONGODB connected'));

    app.locals.client = client;
    
    const db = client.db('monVieuxGrimoire');
    const usersCollection = db.collection('users');
    const booksCollection = db.collection('books');

    app.locals.collections = {
        users: usersCollection,
        books: booksCollection
    }
}

module.exports = initializeMongo;