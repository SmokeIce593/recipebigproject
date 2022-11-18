import React, { useState } from 'react';
import './recover.css';

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
        
        try{
        
        }
    catch(e)
        {
            alert(e.toString());
            return;
        }    
    }
    
const verifyCode = async event =>
{
}

const app_name = 'recipeprojectlarge'
	
var email;

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
            <span className="innerText">A verification code has been sent to your e-mail. Please enter the code to verify your account:</span><br />
            <input type="text" id="code" placeholder="Verification Code" className="inputfield"
                ref={(c) => code = c} /><br />
            <div id="bumper" className="buffer"><span id="verifyResult" className = "error">{message}</span></div> 
            <input type="submit" id="submitButton" className="submitButton" value ="Submit" onClick={verifyCode} />
        </form>

	</div>
	);
}

export default Recover;