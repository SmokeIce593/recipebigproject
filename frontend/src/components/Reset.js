import React, { useState } from 'react';
import './recover.css';

var password
var message

const resetPassword = async event=>
{
}

const goLogin = async event=>
    {
    	window.location.href = '/login';
    }

function Reset(){

return(
	<div>
	<span id="background-support" className="drop-backgroundimg">⠀</span>
	<input type="submit" id="returnButton" className="returnButton" value ="Return to Login" onClick={goLogin} />
	<form className="recoverField">
	    <span id="inner-title" className="titlefield">Password Reset</span><br />
	    <span className="innerText">Create a new password for your account. Password must be between 8 to 15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character:</span><br />
            <input type="text" id="email" placeholder="Password" className="inputfield" ref={(c) => password = c} /><br />
            <input type="text" id="email" placeholder="Confirm Password" className="inputfield" ref={(c) => password = c} /><br />
            <div id="bumper" className="buffer"><span id="passwordResult" className = "error">{message}</span></div> 
            <input type="submit" id="submitButton" className="submitButton" value ="Submit" onClick={resetPassword} />
        </form>
        </div>
        );
}

export default Reset;