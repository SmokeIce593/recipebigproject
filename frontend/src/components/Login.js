import React, { useState } from 'react';
import './login.css';
import { useJwt } from "react-jwt";

function Login()
{
    let bp = require('./Path.js');
    var storage = require('../tokenStorage.js');

    var loginName;
    var loginPassword;

    const [message,setMessage] = useState('');

    const doLogin = async event => 
    {
        event.preventDefault();

        var obj = {login:loginName.value,password:loginPassword.value};
        var js = JSON.stringify(obj);
        
        try
        {    
//            const response = await fetch('http://localhost:5000/api/login',
            const response = await fetch(bp.buildPath('api/login'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            if( res.error !== "")
            {
                setMessage(res.error);
            }
            else
            {
                storage.storeToken(res);

                let userId = res.id;
                let firstName = res.fn;
                let lastName = res.ln;
                
                var user = {firstName:res.firstName,lastName:res.lastName,id:res.id}
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                window.location.href = '/cards';
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }    
    };

const goRegister = async event=>
    {
        window.location.href = '/register';
    }

    return(
      <div id="loginDiv" >
        <form onSubmit={doLogin} className="loginBox">
            <span id="inner-title" className="title">Log In</span><br />
            <input type="text" id="loginName" placeholder="Username" className="input"
                ref={(c) => loginName = c} /><br />
            <input type="password" id="loginPassword" placeholder="Password" className="input"
                ref={(c) => loginPassword = c} /><br />
            <input type="submit" id="loginButton" className="loginbutton" value ="Log In"
                onClick={doLogin} />
            <span id="loginResult" className = "error">{message}</span>
        </form>
        <input type="button" id="registerButton" className="registerbutton" value="Register" 
                onClick={goRegister}/>
     </div>

    );
};

export default Login;
