const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
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
  const text = 'SELECT * FROM users WHERE username = $1';
  const values = [login];
  const now = await client.query(text, values);
  await client.end();

  

  if(now.rowCount > 0 && await bcrypt.compare(password, now.rows[0]["password"])){
    console.log(now.rows[0]["id"]);
    id = now.rows[0]["id"];
    fn = now.rows[0]["firstname"];
    ln = now.rows[0]["lastname"];
  }
  var ret = { id:id, firstName:fn, lastName:ln, error:''};
  res.status(200).json(ret);
});

app.post('/api/register', async (req, res, next) => 
{
  // incoming: login, password
  // outgoing: id, firstName, lastName, error
	
  var error = '';
  var id = -1;
  var fn = '';
  var ln = '';

  const { login, password, email, firstname, lastname, securityquestion, securityanswer } = req.body;
  const connectionString = process.env.DATABASE_URL;

  const hashed = await bcrypt.hash(password, 10);
  //console.log(login + password + email + firstname + lastname + securityquestion + securityanswer);
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  const duplicatelogin = 'SELECT * FROM users WHERE username = $1';
  const valueslogincheck = [login];
  const logincheck = await client.query(duplicatelogin, valueslogincheck);
  
  if(logincheck.rowCount == 0)
  {
    const text = 'Insert into users (username, password, email, firstname, lastname, securityquestion, securityanswer) values ($1, $2, $3, $4, $5, $6, $7)';
    const values = [login, hashed, email, firstname, lastname, securityquestion, securityanswer];
    const now = await client.query(text, values);
  
    // Rather than this need to do error tracking with sql query
    id = 100;
  }
  await client.end();

  
  var ret = { id:id, firstName:fn, lastName:ln, error:''};
  res.status(200).json(ret);
});

app.post('/api/savetags', async (req, res, next) => 
{
  // incoming: fkrecipeid, tagname, tagcolor, tagtype
  // outgoing: id, fkrecipeid, tagname, tagcolor, tagtype, error
	
  var error = '';
  var id = -1;
  var tn = '';
  var tc = '';
  var tt = '';

  const { fkrecipeid, tagname, tagcolor, tagtype } = req.body;
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  const duplicatetag = 'SELECT * FROM tags WHERE tagname = $1';
  const valuestagcheck = [tagname];
  const tagcheck = await client.query(duplicatetag, valuestagcheck);
  
  if(tagcheck.rowCount == 0)
  {
    const text = 'Insert into tags (fkrecipeid, tagname, tagcolor, tagtype) values ($1, $2, $3, $4)';
    const values = [fkrecipeid, tagname, tagcolor, tagtype];
    const now = await client.query(text, values);
  
    // Rather than this need to do error tracking with sql query
    id = 100;
  }
  await client.end();
  
  var ret = { id:fkrecipeid, tn:tagname, tc:tagcolor, tt:tagtype, error:''};
  res.status(200).json(ret);
});

app.post('/api/savecategory', async (req, res, next) => 
{
  // incoming: fkrecipeid, categoryname, categorycolor
  // outgoing: id, fkrecipeid, categoryname, categorycolor
	
  var error = '';
  var id = -1;
  var cn = '';
  var cc = '';

  const { fkrecipeid, categoryname, categorycolor } = req.body;
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  const duplicatecat = 'SELECT * FROM category WHERE categoryname = $1';
  const valuescatcheck = [categoryname];
  const catcheck = await client.query(duplicatecat, valuescatcheck);
  
  if(catcheck.rowCount == 0)
  {
    const text = 'Insert into category (fkrecipeid, categoryname, categorycolor) values ($1, $2, $3)';
    const values = [fkrecipeid, categoryname, categorycolor];
    const now = await client.query(text, values);
  
    // Rather than this need to do error tracking with sql query
    id = 100;
  }
  await client.end();
  
  var ret = { id:fkrecipeid, cn:categoryname, cc:categorycolor, error:'' };
  res.status(200).json(ret);
});

app.delete('/api/deletetags', async (req, res, next) => 
{
  // incoming: fkrecipeid, tagname, tagcolor, tagtype
  // outgoing: id, fkrecipeid, tagname, tagcolor, tagtype, error
	
  var error = '';
  var id = -1;
  var tn = '';
  var tc = '';
  var tt = '';

  const { fkrecipeid, tagname, tagcolor, tagtype } = req.body;
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  const text = 'DELETE FROM tags WHERE tagname = $1';
  const values = [tagname];
  const now = await client.query(text, values);
  // Rather than this need to do error tracking with sql query
  id = 100;
  await client.end();
  
  var ret = { id:fkrecipeid, tn:tagname, tc:tagcolor, tt:tagtype, error:''};
  res.status(200).json(ret);
});

app.delete('/api/deletecategory', async (req, res, next) => 
{
  // incoming: fkrecipeid, categoryname, categorycolor
  // outgoing: id, fkrecipeid, categoryname, categorycolor
	
  var error = '';
  var id = -1;
  var cn = '';
  var cc = '';

  const { fkrecipeid, categoryname, categorycolor } = req.body;
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  const text = 'DELETE FROM category WHERE categoryname = $1';
  const value = [categoryname];
  const now = await client.query(text, value);
  // Rather than this need to do error tracking with sql query
  id = 100;
  await client.end();
  
  var ret = { id:fkrecipeid, cn:categoryname, cc:categorycolor, error:'' };
  res.status(200).json(ret);
});

app.delete('/api/deleterecipe', async (req, res, next) => 
{
  // incoming: fkrecipeid, categoryname, categorycolor
  // outgoing: id, fkrecipeid, categoryname, categorycolor
	
  var error = '';
  var rid = -1;
  var rn = '';

  const { id, recipe } = req.body;
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  const text = 'DELETE FROM recipe WHERE id = $1';
  const value = [id];
  const now = await client.query(text, value);
  
  const tagtext = 'DELETE FROM tags WHERE fkrecipeid = $1';
  const tagvalue = [id];
  const tagnow = await client.query(tagtext, tagvalue);

  const cattext = 'DELETE FROM category WHERE fkrecipeid = $1';
  const catvalue = [id];
  const catnow = await client.query(cattext, catvalue);
  await client.end();
  
  var ret = { rid:id, rn:recipename, error:'' };
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

