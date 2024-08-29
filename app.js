    //backend Node-Express
    const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase';

app.use(express.static('public'));

app.post('/add-date', (req, res) => {
    const userData = req.body;
    const MongoClient = require('mydatabase').MongoClient;

    MongoClient.connect(url, function(err, client) {
        if (err) {
            console.log(err);
        } else {
            console.log('Connected to MongoDB');
            const db = client.db(dbName);
            const collection = db.collection('users');

            collection.insertOne(userData, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('User data saved successfully');
                    res.send('Fecha importante agregada correctamente');
                }
            });
        }
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
//