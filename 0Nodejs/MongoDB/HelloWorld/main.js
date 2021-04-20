const {MongoClient} = require('mongodb');
const assert = require('assert');

const uri = "mongodb+srv://root:root@cluster0.acxcn.mongodb.net/sample_weatherdata?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    console.log('Connected successfully to server');

    const dbName = 'sample_weatherdata';

    const db = client.db(dbName);

    const collection = db.collection('data');

    collection.find({st : "x+47600-047900"}).toArray((err, docs) =>{
        assert.equal(err, null);

        console.log('Found the following records');
        console.log(docs);

        // Update document where a is 2, set b equal to 1
        collection.updateOne({ st : "x+47600-047900" }, { $set: { type: "qqqqqqqqqqq" } }, function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);

            console.log('Updated the document with the field st equal to x+47600-047900');


        });
    });

    //client.close();
});

