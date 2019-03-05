

// server setup
const express = require('express')
const app = express()
const port = 3001

/*using request-promise for chaining*/
var rp = require('request-promise');
const randomUrl = "http://nidhoggur.rhi.hi.is/ordanet-api/api/skyldheiti/handahof.json";
const skyldheitiUrl = "http://nidhoggur.rhi.hi.is/ordanet-api/api/skyldheiti/?frumfletta="; // + flettan



/*fetching a random url from the orðanet/handahof API*/
var randomOptions = {
  uri: "http://nidhoggur.rhi.hi.is/ordanet-api/api/skyldheiti/handahof.json",
  headers: {
      'User-Agent': 'Request-Promise'
  },
  json: true // Automatically parses the JSON string in the response
};

var skyldheitiOptions = {
  uri: "http://nidhoggur.rhi.hi.is/ordanet-api/api/skyldheiti/?frumfletta=", // + flettan
  headers: {
      'User-Agent': 'Request-Promise'
  },
  json: true // Automatically parses the JSON string in the response
}

app.get('/fletta', (req, res) => {
  rp(randomOptions)
    .then(function (random) {
      /*if (random.results[0].frumfletta.includes(" ")) {
        random = rp(randomOptions)
        console.log(random)
      }
      console.log("fyrir return")*/
      return random.results[0].frumfletta;
    })
    .then(function (frumfletta) {
      return rp({ uri: "http://nidhoggur.rhi.hi.is/ordanet-api/api/skyldheiti/?frumfletta=" + frumfletta, 
        headers: { 'User-Agent': 'Request-Promise' },
        json: true
      })
    })
    .then(function (result) {
      console.log(result)
      var skyldflettur = [];
      result.results.forEach(element => {
        skyldflettur.push(element.skyldfletta)
      });
      console.log(skyldflettur)
      res.header("Access-Control-Allow-Origin", "*")
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"),
      res.status(200).send({
        success: 'true',
        message: 'retrieved successfully',
        fletta: { "frumfletta" : result.results[0].frumfletta,
              "skyldflettur" : skyldflettur }
        })
    })
    .catch(function (err) {
      console.log(`API call failed. ${err}`);
    });
});

// server open
app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res, next) {
  // Handle the get for this route
});

app.post('/', function(req, res, next) {
 // Handle the post for this route
});

// Words
/*function getRandomInt() {
  return Math.floor(Math.random() * Math.floor(264978));
}*/
// hvert orð er með margar skyldflettur. fyrir hvert orð vil ég setja inn færslu, og undirfærslur með upplýsingum um hverja skyldflettu

/*currentIndex = getRandomInt()
currentWord = word.results[currentIndex].frumfletta
currentSkyldfletta = word.results[currentIndex].skyldfletta

console.log(currentWord)
console.log(currentSkyldfletta)
*/

//MONGODB CODE
/* const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'word-associations';

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
 client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
});
*/ 