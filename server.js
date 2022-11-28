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
  
  if(password === ''){
    error = await accountsettingsnopass(id, login, firstname, lastname);
  }
  else{
    const hashed = await bcrypt.hash(password, 10);
    error = await accountsettingspass(id, login, firstname, lastname, hashed);
  }

  var ret = { id:id, firstName:firstname, lastName:lastname, email:email, username:login,error:error};
  res.status(200).json(ret);
});

async function accountsettingsnopass(id, login, firstname, lastname){
  var error = '';
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try{
    await client.connect();
    const duplicatelogin = 'SELECT * FROM users WHERE username = $1 AND id != $2';
    const valueslogincheck = [login, id];
    const logincheck = await client.query(duplicatelogin, valueslogincheck);

    if(logincheck.rowCount == 0)
    {
      const text = 'Update users set username = $2, firstname = $3, lastname = $4 WHERE id = $1';
      const values = [id, login, firstname, lastname];
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

    return error;
}

async function accountsettingspass(id, login, firstname, lastname, hashed){
  var error = '';
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

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

    return error;
}


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
  var recipe;
  var ingredient = [];
  var direction = [];
  var tag = [];

  const {recipeID} = req.body;
  const connectionString = process.env.DATABASE_URL;
  
  console.log(recipeID);
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try{
    await client.connect();
    const recipequery = 'Select * from recipes where id = $1';
    const recipevalue = [recipeID];
    const recipeq = await client.query(recipequery, recipevalue);
    
    const ingredientquery = 'Select * from ingredients where recipefk = $1';
    const ingredientvalue = [recipeID];
    const ingredientq = await client.query(ingredientquery, ingredientvalue);

    const tagquery = 'Select * from tags where fkrecipeid = $1';
    const tagvalue = [recipeID];
    const tagq = await client.query(tagquery, tagvalue);

    const directionquery = 'Select * from directions where fkrecipe = $1';
    const directionvalue = [recipeID];
    const directionq = await client.query(directionquery, directionvalue);
    recipe = recipeq.rows[0];
    for( var i=0; i<ingredientq.rowCount; i++ )
    {
      ingredient.push(ingredientq.rows[i]);
      console.log(ingredientq.rows[i]["ingredient"]);
    }

    for( var i=0; i<tagq.rowCount; i++ )
    {
      tag.push(tagq.rows[i]);
      console.log(tagq.rows[i]["tagname"]);
    }
  
    for( var i=0; i<directionq.rowCount; i++ )
    {
      direction.push(directionq.rows[i]);
    }
  
  await client.end();
  }
  catch{
    error = "Server related issues, please try again.";
  }

  console.log(error);
  var ret = {recipe:recipe, ingredients:ingredient,directions:direction, tags:tag, error: error};
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


app.post('/api/search', async (req, res, next) => 
{
  // incoming: fkrecipeid, categoryname, categorycolor
  // outgoing: id, fkrecipeid, categoryname, categorycolor
  
  var error = '';
  var ret = [];
  const {search} = req.body;
  console.log(search)
  const connectionString = process.env.DATABASE_URL;
  var editedsearch = "%" + search + "%";
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try{
    await client.connect();
    const text = "Select r.*, u.firstname, u.lastname from recipes as r left JOIN categories as c ON r.id = c.fkrecipeid left JOIN tags as t ON r.id = t.fkrecipeid left join users as u ON Cast(r.userid as varchar) = Cast(u.id as varchar) Where (r.recipe like $1 OR t.tagname like $1 OR c.categoryname like $1 OR u.firstname like $1 or u.lastname like $1) GROUP BY r.id, r.recipe, r.text_recipe, u.firstname, u.lastname ORDER BY r.date DESC";
    const value = [editedsearch];
    const now = await client.query(text, value);
    console.log("made it here");
    
    for( var i=0; i<now.rowCount; i++ )
    {
      ret.push(now.rows[i]);
    }
    
    await client.end();
  }
  catch{
    error = "Server related issues, please try again.";
  }


  
  var ret = {filter: ret, error: error};
  res.status(200).json(ret);
});

app.post('/api/myrecipes', async (req, res, next) => 
{
  // incoming: fkrecipeid, categoryname, categorycolor
  // outgoing: id, fkrecipeid, categoryname, categorycolor
	
  var error = '';
  var ret = [];
  const {userID} = req.body;
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  console.log(userID);
  try{
    await client.connect();
    const text = "Select * from recipes as r where r.userid = $1 ORDER BY r.date DESC";
    const value = [userID];
    const now = await client.query(text, value);
    console.log("Made it here");
    for( var i=0; i<now.rowCount; i++ )
    {
      ret.push(now.rows[i]);
    }
    await client.end();
  }
  catch{
    error = "Server related issues, please try again.";
  }


  
  var ret = {filter: ret, error: error};
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
    subject: 'Recipeasy verification code',
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


app.post('/api/deleterecipe', async (req, res, next) => 
{
  // incoming: fkrecipeid, categoryname, categorycolor
  // outgoing: id, fkrecipeid, categoryname, categorycolor
	
  var error = '';
  var rid = -1;
  var rn = '';

  const { id } = req.body;
  const connectionString = process.env.DATABASE_URL;

  console.log(id);
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const text = 'DELETE FROM recipes WHERE id = $1';
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

  var ret = { rid:id, error:'' };
  res.status(200).json(ret);
});

app.post('/api/editrecipe', async (req, res, next) => 
{

  var error = '';
  const { recipeID, recipename, recipetext, fkuser, privaterecipe, tags, ingredients, directions } = req.body;
  var deleterecipe = await deleterecipe(recipeID);

  const connectionString = process.env.DATABASE_URL;

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try{
    await client.connect();
    const text = 'Insert into recipes (id, recipe, text_recipe, userid, privatetable) values ($1, $2, $3, $4, $5)';
    const value = [recipeID, recipename, recipetext, fkuser, privaterecipe];
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

async function deleterecipe(id){
  var error = '';
  var rn = '';
  const connectionString = process.env.DATABASE_URL;

  console.log(id);
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const text = 'DELETE FROM recipes WHERE id = $1';
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
  var ret = { rid:id, error:error };
  return ret;
}




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

