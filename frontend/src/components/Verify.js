import React, { useState } from 'react';
import './verify.css'

const mailIcon = new URL("/public/mail.png",import.meta.url);

function Verify()
{
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var email = ud.email;
    //alert("Email   " + ud.email);
    var codeInput;
    //localStorage.removeItem('user_data'); // temporarily remove user info until they are verified
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

    const [message,setMessage] = useState('');

    const doResend = async event=>
    {
        // resend the verification code email
    }

    const doVerify = async event => 
    {

    };

   return(
        <div id="verifyDiv" className='main-container'>
        <form onSubmit={doVerify} className="verifyBoxfield">
            <img src={mailIcon} alt="mail icon" className="mailIcon"></img>
            <div id="header" className="header">Check your inbox</div>

            <div id="text1" className="text">We sent a verification email to</div>
            <div id="regEmail" className="text">{email}</div>

            <div id="text2" className="smalltext">Please enter the secure verification code</div>
            <input type="text" id="verifCode" placeholder="Secure verification code" className="input"
                ref={(c) => codeInput = c} />
            <input type="submit" id="verifyButton" className="verifybutton" value="Verify" 
                onClick={doVerify}/>
        </form>

            <div id="text3" className="smalltext">Didn't receive the email?</div>
            <input type="button" id="resendButton" className="resendbutton" value="Click to resend" 
                onClick={doResend}/>
        </div>
   );
};

export default Verify;
