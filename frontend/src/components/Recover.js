import React, { useState } from 'react';
import './recover.css';

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

function Recover(){

var email;
var code;
var password;
const [message,setMessage] = useState('');


const findEmail = async event => 
    {
    	event.preventDefault();
    	
    	var obj = {email:email.value};
        var js = JSON.stringify(obj);
        

        try
        {    
            const response = await fetch(buildPath('api/codecreation'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            if( res.error !== "")
            {
                //setMessage(res.error);
            }
            else
            {
                //setMessage('');
                //window.location.href = '/home';
                document.getElementById("codeDiv").style.visibility = 'visible';
                document.getElementById("codeDiv").style.display = 'block';
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }    
    }
    
const verifyCode = async event =>
{
    event.preventDefault();
    	var obj = {code:code.value};
        var js = JSON.stringify(obj);
        try
        {    
            const response = await fetch(buildPath('api/passwordverification'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            if(res.userID != '')
            {
                var user = {firstName:res.firstName,lastName:res.lastName,id:res.id,email:res.email, username:res.username, securityquestion:res.securityquestion, securityanswer:res.securityanswer, verified: res.verified};
                localStorage.setItem('user_data', JSON.stringify(user));
                window.location.href = '/Reset';
            }
            else
            {
                setMessage('Invalid Code.');
                //window.location.href = '/home';
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }    
}

const app_name = 'recipeprojectlarge'

const goLogin = async event=>
{
window.location.href = '/login';
}
	
return(
	<div>
	<span id="background-support" className="drop-backgroundimg">⠀</span>
	<input type="submit" id="returnButton" className="returnButton" value ="Return to Login" onClick={goLogin} />
	<form onSubmit={findEmail} className="recoverField">
            <span id="inner-title" className="titlefield">Account Recovery</span><br />
            <span className="innerText">Enter the e-mail associated with your account:</span><br />
            <input type="text" id="email" placeholder="Enter your e-mail..." className="inputfield"
                ref={(c) => email = c} /><br />
            <div id="bumper" className="buffer"><span id="emailResult" className = "error">{message}</span></div> 
            <input type="submit" id="submitButton" className="submitButton" value ="Submit" onClick={findEmail} />
            <div id="codeDiv" className="codeDiv">
		    <span className="innerText">A verification code has been sent to your e-mail. Please enter the code to verify your account:</span><br />
		    <div id="bumper" className="buffer"><input type="button" id="recoverLink" className = "recoverLink" value="Didn't get an e-mail? Click here to resend" onClick={findEmail} /></div>
		    <input type="text" id="code" placeholder="Verification Code" className="inputfield"
		        ref={(c) => code = c} /><br />
		    <div id="bumper" className="buffer"><span id="verifyResult" className = "error">{message}</span></div> 
		    <input type="submit" id="submitButton" className="submitButton" value ="Submit" onClick={verifyCode} />
            </div>
        </form>

	</div>
	);
}

export default Recover;