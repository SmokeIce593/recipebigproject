import React, { useState } from 'react';
import './recover.css';

function Reset()
{
    var password;
    var passwordconfirm;
    const [message,setMessage] = useState('');
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud.id;
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

    const resetPassword = async event=>
    {
        event.preventDefault();
        
        if(password.value != passwordconfirm.value)
        {
            setMessage("Passwords do not match.");
            return;
        }
        else
        {
            setMessage('');
        }

        var obj = {password:password.value};
        var js = JSON.stringify(obj);

        var passwordcode = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

        if(!obj.password.match(passwordcode)){
            setMessage("Your password does not meet requirements: Between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.")
            return;
        }
        else
        {
            setMessage('');
        }

        //alert(userId + " " + password.value);
        var obj = {id: userId , password:password.value};
        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch(buildPath('api/changepassword'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            //alert(res.error);
            if( res.error !== "")
            {
                setMessage(res.error);
            }
            else
            {
                //alert("Made to end");
                setMessage('');
                localStorage.removeItem("user_data");
                window.location.href = '/login'; 
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }    
    }

    const goLogin = async event=>
    {
        window.location.href = '/login';
    }

    return(
        <div>
        <span id="background-support" className="drop-backgroundimg">⠀</span>
        <input type="submit" id="returnButton" className="returnButton" value ="Return to Login" onClick={goLogin} />
        <form className="recoverField">
            <span id="inner-title" className="titlefield">Password Reset</span><br />
            <span className="innerText">Create a new password for your account. Password must be between 8 to 15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.</span><br />
                <input type="password" id="password1" placeholder="Password" className="inputfield" ref={(c) => password = c} /><br />
                <input type="password" id="password2" placeholder="Retype password" className="inputfield" ref={(c) => passwordconfirm = c} /><br />
                <div id="bumper" className="buffer"><span id="passwordResult" className = "error">{message}</span></div> 
                <input type="submit" id="submitButton" className="submitButton" value ="Submit" onClick={resetPassword} />
            </form>
            </div>
    );
};

export default Reset;