import React, { useState } from 'react';
import './verify.css'

const mailIcon = new URL("/public/mail.png",import.meta.url);

function Verify()
{
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

    var _ud = localStorage.getItem('user_data');
    localStorage.removeItem('user_data'); // temporarily remove user info until they are verified
    var ud = JSON.parse(_ud);

    //var email = ud.email; // won't work bc email not stored to user_data; need to figure out another way
    var email = "placeholder@gmail.com";
    var codeInput;

    const [message,setMessage] = useState('');

    const doResend = async event=>
    {
        // resend the verification code email
    }

    const doVerify = async event => 
    {
        event.preventDefault();

        var obj = {codeInput:verifcode.value};
        var js = JSON.stringify(obj);

        var verifcode = "placeholder";

        if(!obj.email.match(verifcode))
        {
            setMessage("Invalid code.")
            return;
        }

        try
        {
            const response = await fetch(buildPath('api/codeverification'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            if( res.error !== "")
            {
                setMessage(res.error);
            }
            else
            {
                localStorage.setItem('user_data', _ud); // reinstate user data

                setMessage('');
                window.location.href = '/login';
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
    };

   return(
        <div id="verifyDiv" className='main-container'>
            <img src={mailIcon} alt="mail icon" className="mailIcon"></img>
            <div id="header" className="header">Check your inbox</div>

            <div id="text1" className="text">We sent a verification email to</div>
            <div id="regEmail" className="text">{email}</div>

            <div id="text2" className="smalltext">Please enter the secure verification code</div>
            <input type="text" id="verifCode" placeholder="Secure verification code" className="input"
                ref={(c) => codeInput = c} />
            <input type="button" id="verifyButton" className="verifybutton" value="Verify" 
                onClick={doVerify}/>

            <div id="text3" className="smalltext">Didn't receive the email?</div>
            <input type="button" id="resendButton" className="resendbutton" value="Click to resend" 
                onClick={doResend}/>

        </div>
   );
};

export default Verify;
