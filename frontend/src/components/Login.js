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
                window.location.href = '/home';
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
        <form onSubmit={doLogin} className="loginBoxfield">
            <span id="inner-title" className="titlefield">Log In</span><br />
            <input type="text" id="loginName" placeholder="Username" className="inputfield"
                ref={(c) => loginName = c} /><br />
            <input type="password" id="loginPassword" placeholder="Password" className="inputfield"
                ref={(c) => loginPassword = c} /><br />
            <div id="bumper" className="buffer"><span id="loginResult" className = "error">{message}</span></div> 
            <input type="submit" id="loginButton" className="loginbuttonfield" value ="Log In"
                onClick={doLogin} />
        </form>
        <input type="button" id="registerButton" className="registerbuttonfield" value="Register" 
                onClick={goRegister}/>
                <br />
        <span id="background-support" className="drop-backgroundimg">⠀</span>
     </div>

    );
};

export default Login;
