import React, { useState } from 'react';
import './verify.css'

const mailIcon = new URL("/public/mail.png",import.meta.url);

function Verify()
{
    var _ud = localStorage.getItem('email_data');
    var ud = JSON.parse(_ud);
    var email = ud.email;
    var codeInput;
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
        event.preventDefault();
    	
    	var obj = {email:email};
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
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }    
    }

    const doVerify = async event => 
    {
        event.preventDefault();
    	var obj = {code:codeInput.value};
        var js = JSON.stringify(obj);
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
                setMessage('');
                if(res.verified === true){
                    var user = {firstName:res.firstName,lastName:res.lastName,id:res.id,email:res.email, username:res.username, securityquestion:res.securityquestion, securityanswer:res.securityanswer, verified: res.verified}
                    localStorage.setItem('user_data', JSON.stringify(user));
                    window.location.href = '/home';
                }
                
                
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
            <div id="bumper" className="buffer"><span id="loginResult" className = "error">{message}</span></div> 
            <input type="button" id="resendButton" className="resendbutton" value="Click to resend" 
                onClick={doResend}/>
        </div>
   );
};

export default Verify;
