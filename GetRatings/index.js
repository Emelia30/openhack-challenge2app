const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');
  let userId = req.query.userId || (req.body && req.body.userId);

  if (!userId) {
    context.res = {
        status: 400,
        body: "Please pass a userId on the query string or in the request body"
    }
  }
  else {
    // Connection URL
    const url = process.env["DB_Connection_String"];
      
    // Database Name
    const dbName = 'challenge2-db';

    // COllection
    const collectionName = 'rating-collection';

    // client reference
    let client;

    try {
      // Use connect method to connect to the Server
      client = await MongoClient.connect(url);
      const db = client.db(dbName);
      const col = db.collection(collectionName);
    
      // Get all documents that match the query
      const docs = await col.find({"userId": userId}).toArray();
      context.log('Length of the database is:' + docs.length);
      const status = (docs.length == 0) ? 404 : 200;

      context.res = {
        status: status,
        headers: {
          "Content-Type": "application/json"
        },
        body: (status == 404) ? '{"errorMessage": "Ratings not found"}' : JSON.stringify(docs)
      };
      //assert.equal(2, docs.length);
    } 
    catch (err) {
      console.log(err.stack);
    }

    if (client) {
      client.close();
    }
  }
};