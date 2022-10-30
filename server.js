const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { Client } = require('pg')
const PORT = process.env.PORT || 5000;
const app = express();
const { Console } = require('console');

app.set( 'port', (process.env.PORT || 5000 ));
app.use(cors());
app.use(bodyParser.json());

var cardList = 
[
  'Roy Campanella',
  'Paul Molitor',
  'Tony Gwynn',
  'Dennis Eckersley',
  'Reggie Jackson',
  'Gaylord Perry',
  'Buck Leonard',
  'Rollie Fingers',
  'Charlie Gehringer',
  'Wade Boggs',
  'Carl Hubbell',
  'Dave Winfield',
  'Jackie Robinson',
  'Ken Griffey, Jr.',
  'Al Simmons',
  'Chuck Klein',
  'Mel Ott',
  'Mark McGwire',
  'Nolan Ryan',
  'Ralph Kiner',
  'Yogi Berra',
  'Goose Goslin',
  'Greg Maddux',
  'Frankie Frisch',
  'Ernie Banks',
  'Ozzie Smith',
  'Hank Greenberg',
  'Kirby Puckett',
  'Bob Feller',
  'Dizzy Dean',
  'Joe Jackson',
  'Sam Crawford',
  'Barry Bonds',
  'Duke Snider',
  'George Sisler',
  'Ed Walsh',
  'Tom Seaver',
  'Willie Stargell',
  'Bob Gibson',
  'Brooks Robinson',
  'Steve Carlton',
  'Joe Medwick',
  'Nap Lajoie',
  'Cal Ripken, Jr.',
  'Mike Schmidt',
  'Eddie Murray',
  'Tris Speaker',
  'Al Kaline',
  'Sandy Koufax',
  'Willie Keeler',
  'Pete Rose',
  'Robin Roberts',
  'Eddie Collins',
  'Lefty Gomez',
  'Lefty Grove',
  'Carl Yastrzemski',
  'Frank Robinson',
  'Juan Marichal',
  'Warren Spahn',
  'Pie Traynor',
  'Roberto Clemente',
  'Harmon Killebrew',
  'Satchel Paige',
  'Eddie Plank',
  'Josh Gibson',
  'Oscar Charleston',
  'Mickey Mantle',
  'Cool Papa Bell',
  'Johnny Bench',
  'Mickey Cochrane',
  'Jimmie Foxx',
  'Jim Palmer',
  'Cy Young',
  'Eddie Mathews',
  'Honus Wagner',
  'Paul Waner',
  'Grover Alexander',
  'Rod Carew',
  'Joe DiMaggio',
  'Joe Morgan',
  'Stan Musial',
  'Bill Terry',
  'Rogers Hornsby',
  'Lou Brock',
  'Ted Williams',
  'Bill Dickey',
  'Christy Mathewson',
  'Willie McCovey',
  'Lou Gehrig',
  'George Brett',
  'Hank Aaron',
  'Harry Heilmann',
  'Walter Johnson',
  'Roger Clemens',
  'Ty Cobb',
  'Whitey Ford',
  'Willie Mays',
  'Rickey Henderson',
  'Babe Ruth'
];

// Server static assets if in production
if (process.env.NODE_ENV === 'production') 
{
  // Set static folder
  app.use(express.static('frontend/build'));

 app.get('*', (req, res) => 
 {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
//const url = 'mongodb+srv://RickLeinecker:WeLoveCOP4331@cluster0.ehunp00.mongodb.net/?retryWrites=true&w=majority';
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
client.connect();

app.post('/api/addcard', async (req, res, next) =>
{
  // incoming: userId, color
  // outgoing: error
	
  const { userId, card } = req.body;

  const newCard = {Card:card,UserId:userId};
  var error = '';

  try
  {
    const db = client.db("COP4331Cards");
    const result = db.collection('Cards').insertOne(newCard);
  }
  catch(e)
  {
    error = e.toString();
  }

  cardList.push( card );

  var ret = { error: error };
  res.status(200).json(ret);
});

app.post('/api/login', async (req, res, next) => 
{
  // incoming: login, password
  // outgoing: id, firstName, lastName, error
	
  var error = '';
  var id = -1;
  var fn = '';
  var ln = '';

  const { login, password } = req.body;
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  const text = 'SELECT * FROM users WHERE username = $1 AND password = $2';
  const values = [login, password];
  const now = await client.query(text, values);
  await client.end();

  

  if(now.rowCount > 0){
    console.log(now.rows[0]["id"]);
    id = now.rows[0]["id"];
    fn = now.rows[0]["firstname"];
    ln = now.rows[0]["lastname"];
  }
/*
  client.query('SELECT * FROM users;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      console.log(JSON.stringify(row)); 
    }
    client.end();
  });
  */

  var ret = { id:id, firstName:fn, lastName:ln, error:''};
  res.status(200).json(ret);
});

app.post('/api/searchcards', async (req, res, next) => 
{
  // incoming: userId, search
  // outgoing: results[], error

  var error = '';

  const { userId, search } = req.body;

  var _search = search.trim();
  
  const db = client.db("COP4331Cards");
  const results = await db.collection('Cards').find({"Card":{$regex:_search+'.*', $options:'r'}}).toArray();
  
  var _ret = [];
  for( var i=0; i<results.length; i++ )
  {
    _ret.push( results[i].Card );
  }
  
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
})

app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

// app.listen(5000); // start Node + Express server on port 5000

app.listen(PORT, () => 
{
  console.log('Server listening on port ' + PORT);
});

