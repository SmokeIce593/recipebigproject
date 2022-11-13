const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const { Client } = require('pg')
const PORT = process.env.PORT || 5000;
const app = express();
const { Console } = require('console');
const {v1: uuidv1, v4: uuidv4} = require('uuid');
//import { useJwt } from "react-jwt";

app.set( 'port', (process.env.PORT || 5000 ));
app.use(cors());
app.use(bodyParser.json());

exports.setApp = function ( app, client)
{
    app.post('/api/addcard', async (req, res, next) =>
    {
        // incoming: userId, color
        // outgoing: error
        
        //const { userId, card } = req.body;
        let token = require('./createJWT.js/');
        const { userId, card, jwtToken } = req.body;

        try
        {
            if(token.isExpired(jwtToken))
            {
                var r = {error:'The JWT is no longer valid', jwtToken: ''};
                res.status(200).json(r);
                return;
            }
        }
        catch(e)
        {
            console.log(e.message);
        }

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

        // Refresh the JWT
        var refreshedToken = null;
        try
        {
            refreshedToken = token.refresh(jwtToken);
        }
        catch(e)
        {
            console.log(e.message);
        }

        var ret = {error: error, jwtToken: refreshedToken };
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

        var ret ;

        const { login, password } = req.body;
        const connectionString = process.env.DATABASE_URL;

        const client = new Client({
            connectionString: connectionString,
            ssl: { rejectUnauthorized: false }
        });

        try
        {
            await client.connect();
            const text = 'SELECT * FROM users WHERE username = $1';
            const values = [login];
            const now = await client.query(text, values);
            await client.end();

            if(now.rowCount > 0 && await bcrypt.compare(password, now.rows[0]["password"]))
            {
                console.log(now.rows[0]["id"]);
                id = now.rows[0]["id"];
                fn = now.rows[0]["firstname"];
                ln = now.rows[0]["lastname"];

                try
                {
                    const token = require("./createJWT.js");
                    ret = token.createToken( fn, ln, id );
                }
                catch(e)
                {
                    ret = {error:e.message};
                }
            }
            else
            {
                error = "Invalid Username/Password"
                ret = {error:"Login/Password incorrect"};
            }
        }
        catch
        {
            error = "Server related issues, please try again.";
        }

        var ret = { id:id, firstName:fn, lastName:ln, error:error };
        res.status(200).json(ret);
    });


    app.post('/api/register', async (req, res, next) => 
    {
        // incoming: login, password, email, firstname, lastname, securityquestion, securityanswer
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

        try{
            await client.connect();
            const duplicatelogin = 'SELECT * FROM users WHERE username = $1';
            const valueslogincheck = [login];
            const logincheck = await client.query(duplicatelogin, valueslogincheck);

            const duplicateemail = 'SELECT * FROM users WHERE email = $1';
            const valuesemailcheck = [email];
            const emailcheck = await client.query(duplicateemail, valuesemailcheck);
            
            if(logincheck.rowCount == 0)
            {
                const text = 'Insert into users (username, password, email, firstname, lastname, securityquestion, securityanswer) values ($1, $2, $3, $4, $5, $6, $7)';
                const values = [login, hashed, email, firstname, lastname, securityquestion, securityanswer];
                const now = await client.query(text, values);
            }
            await client.end();
        }
        catch
        {
            error = "Server related issues, please try again.";
        }
        
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

        try
        {
            await client.connect();
            const duplicatetag = 'SELECT * FROM tags WHERE tagname = $1';
            const valuestagcheck = [tagname];
            const tagcheck = await client.query(duplicatetag, valuestagcheck);
            
            if(tagcheck.rowCount == 0)
            {
                const text = 'Insert into tags (fkrecipeid, tagname, tagcolor, tagtype) values ($1, $2, $3, $4)';
                const values = [fkrecipeid, tagname, tagcolor, tagtype];
                const now = await client.query(text, values);
            }
            await client.end();
        }
        catch
        {
            error = "Server related issues, please try again.";
        }
        
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
        catch
        {
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

        try
        {
            await client.connect();
            const text = 'DELETE FROM tags WHERE tagname = $1';
            const values = [tagname];
            const now = await client.query(text, values);

            await client.end();
        }
        catch
        {
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

        try
        {
            await client.connect();
            const text = 'DELETE FROM category WHERE categoryname = $1';
            const value = [categoryname];
            const now = await client.query(text, value);
            await client.end();
        }
        catch
        {
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

        const {recipename, recipetext, fkuser } = req.body;
        const connectionString = process.env.DATABASE_URL;

        const client = new Client({
            connectionString: connectionString,
            ssl: { rejectUnauthorized: false }
        });

        try
        {
            await client.connect();
            const text = 'Insert into recipe (recipe text_recipe, userid) values ($1, $2, $3)';
            const value = [recipename, recipetext, fkuser];
            const now = await client.query(text, value);
            await client.end();
        }
        catch
        {
            error = "Server related issues, please try again.";
        }
        
        var ret = {error: error};
        res.status(200).json(ret);
    });


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

        try
        {
            await client.connect();
            const text = 'Update recipes set recipe = $1, text_recipe = $2, userid = $3 where id = $4';
            const value = [recipename, recipetext, fkuser, recipeID];
            const now = await client.query(text, value);
            await client.end();
        }
        catch
        {
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

        try
        {
            await client.connect();
            const text = "Select r.*, u.firstname, u.lastname from recipes as r left JOIN categories as c ON Cast(r.id as int) = Cast(c.fkrecipeid as int) left JOIN tags as t ON Cast(r.id as int) = Cast(t.fkrecipeid as int) left join users as u ON Cast(r.userid as int) = Cast(u.id as int) Where (r.recipe like '%$1%' OR t.tagname like '%$1%' OR c.categoryname like '%$1%' OR u.firstname like '%$1%' or u.lastname like '%$1%') GROUP BY r.id, r.recipe, r.text_recipe, u.firstname, u.lastname";
            const value = [search];
            const now = await client.query(text, value);
            await client.end();
        }
        catch
        {
            error = "Server related issues, please try again.";
        }
        
        var ret = {filter: now, error: error};
        res.status(200).json(ret);
    });


    app.delete('/api/codeverification', async (req, res, next) => 
    {
        // incoming: fkrecipeid, categoryname, categorycolor
        // outgoing: id, fkrecipeid, categoryname, categorycolor
            
        var error = '';
        var code = '';

        const {userID} = req.body;
        const connectionString = process.env.DATABASE_URL;

        const client = new Client({
            connectionString: connectionString,
            ssl: { rejectUnauthorized: false }
        });

        try
        {
            await client.connect();
            const text = "select * from emailvericodes where login_fkid_1 = '$1' AND date < CURRENT_TIMESTAMP AND date > CURRENT_TIMESTAMP - interval '15 minutes' ORDER BY date DESC limit 1";
            const value = [userID];
            const now = await client.query(text, value);
            await client.end();

            if(now.rowCount == 0)
            {
                error = "No code found";
                var ret = {code: '', userid: userID, error: error};
            }
            else
            {
                code = now.rows[0]["generatedcode"];
                var ret = {code: code, userid: userID, error: error};
            }
        }
        catch
        {
            error = "Server related issues, please try again.";
            var ret = {code: '', userid: userID, error: error};
        }
        
        res.status(200).json(ret);
    });


    app.post('/api/codecreation', async (req, res, next) => 
    {
        // incoming: fkrecipeid, categoryname, categorycolor
        // outgoing: id, fkrecipeid, categoryname, categorycolor
            
        var error = '';
        var code = uuid4();

        const {userID} = req.body;
        const connectionString = process.env.DATABASE_URL;

        const client = new Client({
            connectionString: connectionString,
            ssl: { rejectUnauthorized: false }
        });

        try
        {
            await client.connect();
            const text = "Insert into emailvericodes (generatedcode, login_fkid_1) values ($1, $2)";
            const value = [code, userID];
            const now = await client.query(text, value);
            await client.end();
        }
        catch
        {
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

        try
        {
            await client.connect();
            const text = 'Select r.* from recipes as r Inner JOIN tags as t ON Cast(r.id as int) = Cast(t.fkrecipeid as int) where t.id = $1';
            const value = [tagid];
            const now = await client.query(text, value);
            await client.end();
        }
        catch
        {
            error = "Server related issues, please try again.";
        }
        
        var ret = {filter: now, error: error};
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

        try
        {
            await client.connect();
            const text = 'Select r.* from recipes as r Inner JOIN categories as c ON Cast(r.id as int) = Cast(c.fkrecipeid as int) where c.id = $1';
            const value = [categoryid];
            const now = await client.query(text, value);
            await client.end();
        }
        catch
        {
            error = "Server related issues, please try again.";
        }
        
        var ret = {filter: now, error: error};
        res.status(200).json(ret);
    });


    app.get('/api/badwords', async (req, res, next) => 
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

        try
        {
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
        catch
        {
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

        const { userId, search, jwtToken } = req.body;

        try
        {
            if( token.isExpired(jwtToken))
            {
                var r = {error:'The JWT is no longer valid', jwtToken: ''};
                res.status(200).json(r);
                return;
            }
        }
        catch(e)
        {
            console.log(e.message);
        }

        var _search = search.trim();
        
        const db = client.db("COP4331Cards");
        const results = await db.collection('Cards').find({"Card":{$regex:_search+'.*', $options:'r'}}).toArray();
        
        var _ret = [];
        for( var i=0; i<results.length; i++ )
        {
            _ret.push( results[i].Card );
        }
        
        var refreshedToken = null;
        try
        {
            refreshedToken = token.refresh(jwtToken);
        }
        catch(e)
        {
            console.log(e.message);
        }

        var ret = { results:_ret, error: error, jwtToken: refreshedToken };
        res.status(200).json(ret);
    })
}