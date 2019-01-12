//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unnale to connect to MongoBD server');
  }
  console.log('Connected to MongoDB server');

  // delete Many
  db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    console.log(result);
  });

  // delete insertOne

  // findOneAndDelete

  //db.close();
});
