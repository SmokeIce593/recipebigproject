const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const { Client } = require('pg')
const PORT = process.env.PORT || 5000;
const app = express();
const Filter = require('bad-words');
const { Console } = require('console');
const {v1: uuidv1, v4: uuidv4} = require('uuid');
const nodemailer = require('nodemailer');

app.get('/recipes/:query', async (req, res) =>
{
  const api_key = CSNM42zvHHK6kV039mwseZ4YryWHRh7cSfZjHfIn;
  const response = await axios.get(
    `https://api.nal.usda.gov/fdc/v1/foods/search?query=apple&pageSize=2&api_key=${api_key}`
  )

  console.log(response.data.hits)
  res.json(response.data.hits)
});

app.set( 'port', (process.env.PORT || 5000 ));
app.use(cors());
app.use(bodyParser.json());

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

require('dotenv').config();

const app_name = 'recipeprojectlarge'
function buildPath(route)
{
    if (process.env.NODE_ENV === 'production') 
    {
        return 'https://' + app_name +  '.herokuapp.com/' + route;
    }
    else
    {        
        return 'http://localhost:5000/' + route;
    }
}

app.post('/api/login', async (req, res, next) => 
{
  // incoming: login, password
  // outgoing: id, firstName, lastName, error
	
  var error = '';
  var id = '';
  var fn = '';
  var ln = '';
  var email = '';
  var username = '';
  var securityquestion = '';
  var securityanswer = '';
  var verified = '';

  const { login, password } = req.body;
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try{
    await client.connect();
    const text = 'SELECT * FROM users WHERE username = $1';
    const values = [login];
    const now = await client.query(text, values);
    await client.end();

    if(now.rowCount > 0 && await bcrypt.compare(password, now.rows[0]["password"])){
      id = now.rows[0]["id"];
      fn = now.rows[0]["firstname"];
      ln = now.rows[0]["lastname"];
      email = now.rows[0]["email"];
      username = now.rows[0]["username"];
      securityquestion = now.rows[0]["securityquestion"];
      securityanswer = now.rows[0]["securityanswer"];
      verified = now.rows[0]["verifiedcode"];
    }
    else{
      error = "Invalid Username/Password"
    }
  }
  catch{
    error = "Server related issues, please try again.";
  }
  if(error === '' && verified === false){
    var creation = await codecreation(id);
    var errormail = sendemail(email, creation.code);
  }

  var ret = { id:id, firstName:fn, lastName:ln, email:email, username:username, securityquestion:securityquestion, securityanswer:securityanswer, verified:verified, error:error};
  res.status(200).json(ret);
});


app.post('/api/updateinformation', async (req, res, next) => 
{
  // incoming: login, password
  // outgoing: id, firstName, lastName, error
	
  var error = '';

  const {id, login, password, email, firstname, lastname} = req.body;
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  
  const hashed = await bcrypt.hash(password, 10);
  console.log("ID: " + id + " Login: " + login + " hashed: " + hashed + " firstname: " + firstname + " lastname: " + lastname);
  
  try{
    await client.connect();
    const duplicatelogin = 'SELECT * FROM users WHERE username = $1 AND id != $2';
    const valueslogincheck = [login, id];
    const logincheck = await client.query(duplicatelogin, valueslogincheck);

    if(logincheck.rowCount == 0)
    {
      const text = 'Update users set username = $2, password = $3, firstname = $4, lastname = $5 WHERE id = $1';
      const values = [id, login, hashed, firstname, lastname];
      const now = await client.query(text, values);
    }
    else{
      error = "Duplicate Login already exists.";
    }
    await client.end();
    }
    catch{
      error = "Server related issues, please try again.";
    }

  var ret = { id:id, firstName:firstname, lastName:lastname, email:email, username:login,error:error};
  res.status(200).json(ret);
});

async function nutrition(title, ingr){
    const titleInput = document.getElementById('title');
    const recipeInput = document.getElementById('recipe');
    const output = document.getElementById('output');
    const appId = '3c83e59a';
    const apiKey = '7562b5bc9d61a7d8ae68edd47888c04a';

    function fetchRecipe() {
        let title = titleInput.value;
        let ingr = recipeInput.value.split('\n');

        return fetch(`https://wizard.edamam.com/wizard/analyze?app_id=${appId}&app_key=${apiKey}`, {
            method: 'POST',
            cache: 'no-cache', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title, ingr})                       
        }).then(response => response.json());
    }
    
    document.getElementById('CreatePage').addEventListener('submit', function(e) {
        e.preventDefault();
        fetchRecipe().then(data => {
            let fragments = [];

            Object.keys(data.totalDaily).forEach(key => {
                let obj = data.totalDaily[key];

                fragments.push(`<dt>${obj.label}</dt><dd>${obj.quantity}${obj.unit}</dd>`);
            })

            let html = `<dl>
                <dt>Calories</dt>
                <dd>${data.calories}</dd>
                ${fragments.join('')}
                </dl>`;

                output.innerHTML = html;
        })
    })
}

app.post('/api/nutrition', async (req, res, next) => 
{
  const {title, ingr} = req.body;
  var error = await nutrition(title, ingr);
  var ret = {error: error};
  res.status(200).json(ret);
});

async function resetpassword(password, id){
  var error = '';
  console.log("Password: " + password + " ID:" + id);
  const hashed = await bcrypt.hash(password, 10);
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try{
    await client.connect();
    const text = 'Update users set password = $2 WHERE id = $1';
    const values = [id, hashed];
    const now = await client.query(text, values);
    await client.end();
    }
    catch{
      error = "Server related issues, please try again.";
    }
    return error;
}

app.post('/api/changepassword', async (req, res, next) => 
{
  const {id, password} = req.body;
  var error = await resetpassword(password, id);
  var ret = {error: error};
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
  var newid = uuidv4();
  const hashed = await bcrypt.hash(password, 10);

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try{

  
    await client.connect();
    const duplicatelogin = 'SELECT * FROM users WHERE username = $1';
    const valueslogincheck = [login];
    const logincheck = await client.query(duplicatelogin, valueslogincheck);
    
    const duplicateemail = 'SELECT * FROM users WHERE email = $1';
    const valuesemailcheck = [email];
    const emailcheck = await client.query(duplicateemail, valuesemailcheck);
    
    if(emailcheck.rowCount > 0)
    {
      error = "Duplicate Email already exists.";
    }
    else if(logincheck.rowCount == 0)
    {
      const text = 'Insert into users (id, username, password, email, firstname, lastname, securityquestion, securityanswer) values ($1, $2, $3, $4, $5, $6, $7, $8)';
      const values = [newid, login, hashed, email, firstname, lastname, securityquestion, securityanswer];
      const now = await client.query(text, values);
    }
    else{
      error = "Duplicate Login already exists.";
    }
    await client.end();
  }
  catch{
    error = "Server related issues, please try again.";
  }

  var ret = { id:id, firstName:fn, lastName:ln, error:error};
  res.status(200).json(ret);
});

async function savetags(fkrecipeid, tags, tagcolor, tagtype){

  // incoming: fkrecipeid, tagname, tagcolor, tagtype
  // outgoing: id, fkrecipeid, tagname, tagcolor, tagtype, error
	var error = '';
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  for(const tag of tags){
    var newid = uuidv4();
    try{
      const text = 'Insert into tags (id, fkrecipeid, tagname, tagcolor, tagtype) values ($1, $2, $3, $4, $5)';
      const values = [newid, fkrecipeid, tag, tagcolor, tagtype];
      const now = await client.query(text, values);
    }
    catch{
      error = "Server related issues, please try again.";
    }
  }
  await client.end();
  return error;
}


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

  try{

    await client.connect();
    const duplicatecat = 'SELECT * FROM category WHERE categoryname = $1';
    const valuescatcheck = [categoryname];
    const catcheck = await client.query(duplicatecat, valuescatcheck);
    
    if(catcheck.rowCount == 0)
    {
      const text = 'Insert into category (fkrecipeid, categoryname, categorycolor) values ($1, $2, $3)';
      const values = [fkrecipeid, categoryname, categorycolor];
      const now = await client.query(text, values);
    }
    await client.end();
  }
  catch{
    error = "Server related issues, please try again.";
  }
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

  try{

    await client.connect();
    const text = 'DELETE FROM tags WHERE tagname = $1';
    const values = [tagname];
    const now = await client.query(text, values);

    await client.end();
  }
  catch{
    error = "Server related issues, please try again.";
  }
  
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

  try{
    await client.connect();
    const text = 'DELETE FROM category WHERE categoryname = $1';
    const value = [categoryname];
    const now = await client.query(text, value);
    await client.end();
  }
  catch{
    error = "Server related issues, please try again.";
  }
  
  var ret = { id:fkrecipeid, cn:categoryname, cc:categorycolor, error:'' };
  res.status(200).json(ret);
});


app.post('/api/saverecipe', async (req, res, next) => 
{
  // incoming: fkrecipeid, categoryname, categorycolor
  // outgoing: id, fkrecipeid, categoryname, categorycolor

  var error = '';

  const {recipename, recipetext, fkuser, privaterecipe, tags, ingredients, directions} = req.body;
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  var newid = uuidv4();

  try{
    await client.connect();
    const text = 'Insert into recipes (id, recipe, text_recipe, userid, privatetable) values ($1, $2, $3, $4, $5)';
    const value = [newid, recipename, recipetext, fkuser, privaterecipe];
    const now = await client.query(text, value);
    await client.end();
  }
  catch{
    error = "Server related issues, please try again.";
  }

  saveingredients(ingredients, newid);
  savedirections(directions, newid);
  savetags(newid, tags, "orange", "test");

  var ret = {error: error};
  res.status(200).json(ret);
});


app.post('/api/getsinglerecipe', async (req, res, next) => 
{
  // incoming: fkrecipeid, categoryname, categorycolor
  // outgoing: id, fkrecipeid, categoryname, categorycolor

  var error = '';

  const {recipeID} = req.body;
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try{
    await client.connect();
    const recipequery = 'Select * from recipes where id = $1';
    const recipevalue = [userID];
    const recipe = await client.query(text, value);
    
    const ingredientquery = 'Select * from ingredients where recipefk = $1';
    const ingredientvalue = [userID];
    const ingredient = await client.query(text, value);

    const directionquery = 'Select * from ingredients where recipefk = $1';
    const directionvalue = [userID];
    const direction = await client.query(text, value);

  await client.end();
  }
  catch{
    error = "Server related issues, please try again.";
  }


  var _recipe = [];
  for( var i=0; i<recipe.length; i++ )
  {
    _recipe.push(recipe[i]);
  }

  var _ingredient = [];
  for( var i=0; i<ingredient.length; i++ )
  {
    _ingredient.push(ingredient[i]);
  }

  var _direction = [];
  for( var i=0; i<direction.length; i++ )
  {
    _direction.push(direction[i]);
  }

  var ret = {recipe:_recipe, ingredients:_ingredient,directions:_direction, error: error};
  res.status(200).json(ret);
});


async function saveingredients(ingredients, fkrecipeid){
  const connectionString = process.env.DATABASE_URL;
  var error = '';
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  for(const ingredient of ingredients){
    try{
      var newid = uuidv4();
      const text = 'Insert into ingredients (id, ingredient, recipefk) values ($1, $2, $3)';
      const value = [newid, ingredient, fkrecipeid];
      const now = await client.query(text, value);
    }
    catch{
      error = "Server related issues, please try again.";
    }
  }
  await client.end();
  return error;
}


async function savedirections(directions, fkrecipeid){
  const connectionString = process.env.DATABASE_URL;
  var error = '';
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  for(const direction of directions){
    try{
      var newid = uuidv4();
      const text = 'Insert into directions (id, directions, fkrecipe) values ($1, $2, $3)';
      const value = [newid, direction, fkrecipeid];
      const now = await client.query(text, value);
    }
    catch{
      error = "Server related issues, please try again.";
    }
  }
  await client.end();
  return error;
}


app.put('/api/editrecipe', async (req, res, next) => 
{
  // incoming: fkrecipeid, categoryname, categorycolor
  // outgoing: id, fkrecipeid, categoryname, categorycolor
	
  var error = '';

  const {recipeID, recipename, recipetext, fkuser } = req.body;
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try{
    await client.connect();
    const text = 'Update recipes set recipe = $1, text_recipe = $2, userid = $3 where id = $4';
    const value = [recipename, recipetext, fkuser, recipeID];
    const now = await client.query(text, value);
    await client.end();
  }
  catch{
    error = "Server related issues, please try again.";
  }
  
  var ret = {error: error};
  res.status(200).json(ret);
});


app.get('/api/search', async (req, res, next) => 
{
  // incoming: fkrecipeid, categoryname, categorycolor
  // outgoing: id, fkrecipeid, categoryname, categorycolor
	
  var error = '';

  const {search} = req.body;
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try{
    await client.connect();
    const text = "Select r.*, u.firstname, u.lastname from recipes as r left JOIN categories as c ON Cast(r.id as int) = Cast(c.fkrecipeid as int) left JOIN tags as t ON Cast(r.id as int) = Cast(t.fkrecipeid as int) left join users as u ON Cast(r.userid as int) = Cast(u.id as int) Where (r.recipe like '%$1%' OR t.tagname like '%$1%' OR c.categoryname like '%$1%' OR u.firstname like '%$1%' or u.lastname like '%$1%') GROUP BY r.id, r.recipe, r.text_recipe, u.firstname, u.lastname";
    const value = [search];
    const now = await client.query(text, value);
    await client.end();
  }
  catch{
    error = "Server related issues, please try again.";
  }

  var _ret = [];
  for( var i=0; i<now.length; i++ )
  {
    _ret.push(now[i]);
  }
  
  var ret = {filter: _ret, error: error};
  res.status(200).json(ret);
});


app.post('/api/codeverification', async (req, res, next) => 
{
  // incoming: fkrecipeid, categoryname, categorycolor
  // outgoing: id, fkrecipeid, categoryname, categorycolor
	
  var error = '';
  var codeerror = '';
  var userID = '';
  var ret;
  ret = {error: error}

  const {code} = req.body;
  var codefinder = await findcode(code);
  userID = codefinder.userID;
  error = codefinder.error

  console.log("Test: " + userID);
  if(codefinder.error === ''){
    codeerror = await updateverified(userID);
  }

  if(userID != '' && codefinder.error === '' && error == ''){
    ret = await getuserinfo(userID);
    console.log("TESTING:" + ret.id + " " + ret.error);
  }

  // Error capturing
  if(userID == ''){
    error = "Invalid or Expired Code";
  }
  else if(error === '' && codeerror !== ''){
    error = codeerror;
    console.log("codeerror");
  }
  else if(error === '' && codeerror === ''){
    error = ret.error;
  }

  ret.error = error;
  res.status(200).json(ret);
});


app.post('/api/passwordverification', async (req, res, next) => 
{
  // incoming: fkrecipeid, categoryname, categorycolor
  // outgoing: id, fkrecipeid, categoryname, categorycolor

  const {code} = req.body;
  var codefinder = await findcode(code);
  console.log(codefinder.userID);

  var ret = await getuserinfo(codefinder.userID);
  res.status(200).json(ret);
});


async function findcode(code){
  const connectionString = process.env.DATABASE_URL;
  var error = '';
  var userID = '';

  console.log(code);

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try{
    await client.connect();
    const text = "select * from emailvericodes where generatedcode = $1 AND date < CURRENT_TIMESTAMP AND date > CURRENT_TIMESTAMP - interval '15 minutes' ORDER BY date DESC limit 1";
    const value = [code];
    const now = await client.query(text, value);

    if(now.rowCount == 0)
    {
      error = "No code found";
      var ret = {error: error};
    }
    else{
      userID = now.rows[0]["login_fkid_1"];
    }
    // Check for newer codes
    if(userID !== ''){
      const text = "select * from emailvericodes where login_fkid_1 = $1 AND date < CURRENT_TIMESTAMP AND date > CURRENT_TIMESTAMP - interval '15 minutes' ORDER BY date DESC limit 1";
      const value = [userID];
      const newcode = await client.query(text, value);
      if(code !== newcode.rows[0]["generatedcode"]){
        error = 'This is not the newest code';
      }
    }
    
    await client.end();
  }
  catch{
    error = "Server related issues, please try again.";
    var ret = {error: error};
  }

  var ret = {userID: userID, error: error};
  return ret;
}


async function getuserinfo(userID){
  // incoming: login, password
  // outgoing: id, firstName, lastName, error
	
  var error = '';
  var id = '';
  var fn = '';
  var ln = '';
  var email = '';
  var username = '';
  var securityquestion = '';
  var securityanswer = '';
  var verified = '';

  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  console.log("Made it here!!!" + userID);
  try{
    await client.connect();
    const text = 'SELECT * FROM users WHERE id = $1';
    const values = [userID];
    const now = await client.query(text, values);
    await client.end();

    if(now.rowCount > 0){
      id = now.rows[0]["id"];
      fn = now.rows[0]["firstname"];
      ln = now.rows[0]["lastname"];
      email = now.rows[0]["email"];
      username = now.rows[0]["username"];
      securityquestion = now.rows[0]["securityquestion"];
      securityanswer = now.rows[0]["securityanswer"];
      verified = now.rows[0]["verifiedcode"];
    }
    else{
      error = "Invalid Username/Password"
    }
  }
  catch{
    error = "Server related issues, please try again.";
  }

  var ret = { id:id, firstName:fn, lastName:ln, email:email, username:username, securityquestion:securityquestion, securityanswer:securityanswer, verified:verified, error:error};
  return ret;
}


async function updateverified(userID){
  var error = '';
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try{
    await client.connect();
    const text = "Update users set verifiedcode = 'true' where id = $1";
    const value = [userID];
    const now = await client.query(text, value);
    await client.end();
  }
  catch{
    error = "Server related issues, please try again.";
    
  }
  return error;
}


async function checkverified(userID){
  var error = '';
  var verified = '';
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try{
    await client.connect();
    const text = "select * from users where id = $1";
    const value = [userID];
    const now = await client.query(text, value);
    verified = now.rows[0]["verifiedcode"];
    await client.end();
  }
  catch{
    error = "Server related issues, please try again.";
  }
  return verified;
}


async function sendemail(email, code){

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'recipeasy1234@gmail.com',
      pass: 'yqgtnpywqmemiryt'
    }
  });
  
  var html = 'Code: '+ code;
  var mailOptions = {
    from: 'recipeasy1234@gmail.com',
    to: email,
    subject: 'Sending Email using Node.js',
    text: html
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 
}


async function codecreation(userID){
  var error = '';
  var code = uuidv4();

  console.log(userID);
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try{
    await client.connect();
    const text = "Insert into emailvericodes (generatedcode, login_fkid_1) values ($1, $2)";
    const value = [code, userID];
    const now = await client.query(text, value);
    await client.end();
  }
  catch{
    error = "Server related issues, please try again.";
    
  }
  var ret = {code:code, error:error}
  return ret;
}


app.post('/api/codecreation', async (req, res, next) => 
{
  // incoming: fkrecipeid, categoryname, categorycolor
  // outgoing: id, fkrecipeid, categoryname, categorycolor
	
  var error = '';
  var id = '';
  const {email} = req.body;

  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try{
    await client.connect();
    const text = "Select * from users where email = $1";
    const value = [email];
    const now = await client.query(text, value);
    id = now.rows[0]["id"];
    var creation = await codecreation(id);
    var errormail = await sendemail(email, creation.code);

    
    await client.end();
  }
  catch{
    error = "Server related issues, please try again.";
  }
  

  
  
  var ret = {error: error};
  res.status(200).json(ret);
});



app.get('/api/filtertag', async (req, res, next) => 
{
  // incoming: fkrecipeid, categoryname, categorycolor
  // outgoing: id, fkrecipeid, categoryname, categorycolor
	
  var error = '';

  const {tagid} = req.body;
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try{
    await client.connect();
    const text = 'Select r.* from recipes as r Inner JOIN tags as t ON Cast(r.id as int) = Cast(t.fkrecipeid as int) where t.id = $1';
    const value = [tagid];
    const now = await client.query(text, value);
    await client.end();
  }
  catch{
    error = "Server related issues, please try again.";
  }
  
  var _ret = [];
  for( var i=0; i<now.length; i++ )
  {
    _ret.push(now[i]);
  }

  var ret = {filter: _ret, error: error};
  res.status(200).json(ret);
});

app.get('/api/filtercategory', async (req, res, next) => 
{
  // incoming: fkrecipeid, categoryname, categorycolor
  // outgoing: id, fkrecipeid, categoryname, categorycolor
	
  var error = '';

  const {categoryid} = req.body;
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try{
    await client.connect();
    const text = 'Select r.* from recipes as r Inner JOIN categories as c ON Cast(r.id as int) = Cast(c.fkrecipeid as int) where c.id = $1';
    const value = [categoryid];
    const now = await client.query(text, value);
    await client.end();
  }
  catch{
    error = "Server related issues, please try again.";
  }

  var _ret = [];
  for( var i=0; i<now.length; i++ )
  {
    _ret.push(now[i]);
  }
  
  
  var ret = {filter: _ret, error: error};
  res.status(200).json(ret);
});


app.get('/api/badwords', async (req, res, next) => 
{
  const { text } = req.body;

  var filter = new Filter();
  filter.addWords('Noah');
  
  var badword = filter.clean(text);

  if(text !== badword){
    var ret = { wordfound: true };
  }
  var ret = { wordfound: false };

  res.status(200).json(ret);
});


app.delete('/api/badwordscheck', async (req, res, next) => 
{
  const { text } = req.body;

  var Filter = require('bad-words');
  var filter = new Filter();
  
  var ret = { text: filter.clean(text)};
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

  try {
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
  }
  catch{
    error = "Server related issues, please try again.";
  }

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

