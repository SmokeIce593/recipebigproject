const express = require('express');
const bcrypt = require('bcrypt');
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

app.post('/api/register', async (req, res, next) => 
{
  const login = req.body.name;
  const hashPass = await bcrypt.hash(req.body.password,10);
  const email = req.body.email;
  const firstname = req.body.fn;
  const lastname = req.body.ln;
  const securityquestion = req.body.sques;
  const securityanswer = req.body.sans;


  db.getConnection (async (err, connection) => {
    if (err) throw (err)

    const sqlSearch = "SELECT * FROM users WHERE user = ?"
    const search_query = mysql.format(sqlSearch, [login])

    const sqlInsert = "INSERT INTO users VALUES (0,?,?,?,?,?)"
    const insert_query = mysql.format(sqlInsert, [login, hashPass, email,securityquestion,securityanswer])
    
    await connection.query (search_query, async (err, result) => {
      if (err) throw (err)
        console.log("-------> Search Results")
        console.log(result.length)
      if (result.length != 0) {
        connection.release()
        console.log("-------> User already exists")
        res.sendStatus(409) 
      } 
      else {
        await connection.query (insert_query, (err, result)=> {
          connection.release()
          
          if (err) throw (err)
          console.log ("------->Created new User")
          console.log(result.insertId)
          res.sendStatus(201)
        })
      }
    })
  })
});

app.post('/api/login', async (req, res, next) => 
{
  const user = req.body.name
  const password = req.body.password;
  db.getConnection (async (err, connection)=> {
    if (err) throw (err)
    const sqlSearch = "SELECT * from users where username = ?"
    const sql_query = mysql.format(sqlSearch, [user])

    await connection.query (search_query, async (err, result)=> {
      connection.release ()
      if (err) throw (err)
      if (result.length == 0) {
        console.log("------->User does not exist")
        res.sendStatus(404)
      }
      else {
        const hashPass = result[0].password

        if (await bcrypt.compare(password, hashPass)) {
          console.log("------->Login Successful")
          res.send('${username} is loggin in!')
        }
        else {
          console.log ("-------> Password Incorrect")
          res.send("Password incorrect!")
        }
      }
    })
  })
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

