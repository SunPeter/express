/**
 * Created by peter on 14-8-19.
 */
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

MongoClient.connect('mongodb://127.0.0.1:27017/local', function(err, db) {
    if (err){
        console.log(err);
    }
    else{
        var collection=db.collection('test');

        var collection = db.collection('test');
        var doc1 = {'hello':'doc1'};
        var doc2 = {'hello':'doc2'};
        var lotsOfDocs = [{'hello':'doc3'}, {'hello':'doc4'}];

        collection.insert(doc1);

        collection.insert(doc2, {w:1}, function(err, result) {});

        collection.insert(lotsOfDocs, {w:1}, function(err, result) {});

        db.close();
    }
});