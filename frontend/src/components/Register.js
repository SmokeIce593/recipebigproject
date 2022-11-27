import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './register.css'
function Register()
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

    var firstName;
    var lastName;
    var loginName;
    var loginPassword;
    var email;
    var securityQuestion;
    var securityAnswer;

    const [message,setMessage] = useState('');

    const doRegister = async event => 
    {
        event.preventDefault();

        var obj = {login:loginName.value,password:loginPassword.value,email:email.value,firstname:firstName.value,
                lastname:lastName.value,securityquestion:securityQuestion.value,securityanswer:securityAnswer.value};
        var js = JSON.stringify(obj);

        var passwordcode = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        var emailcode = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if(!obj.password.match(passwordcode)){
            setMessage("Your password does not meet requirements: Between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.")
            return;
        }

        if(!obj.email.match(emailcode)){
            setMessage("Please enter a valid email.")
            return;
        }

        try
        {    
//            const response = await fetch('http://localhost:5000/api/login',
            const response = await fetch(buildPath('api/register'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            if( res.error !== "")
            {
                setMessage(res.error);
            }
            else
            {
                //alert("here");
                //var email = {email: res.email}
                //localStorage.setItem('email_data', JSON.stringify(email));

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

    const goLogin = async event=>
    {
        window.location.href = '/login';
    }

    return(
        <div id="registerDiv">
        <form onSubmit={doRegister} className="registerBox">
            <span id="inner-title" className="title">Create an account</span>
            <input type="text" id="firstName" placeholder="First Name" className="input"
                ref={(c) => firstName = c} />
            <input type="text" id="lastName" placeholder="Last Name" className="input"
                ref={(c) => lastName = c} />
            <input type="text" id="email" placeholder="Email" className="input"
                ref={(c) => email = c} />
            <input type="text" id="loginName" placeholder="Username" className="input"
                ref={(c) => loginName = c} />
            <input type="password" id="loginPassword" placeholder="Password" className="input"
                ref={(c) => loginPassword = c} />
            <label>
                <span id="security-title" className="sub-title">Security question:</span>
                
                <select id="securityQuestion" name="securityQuestion" className="input"
                ref={(c) => securityQuestion = c}>
                    <option value="0">What is your father's middle name?</option>
                    <option value="1">What was the name of your high school?</option>
                    <option value="2">What is the name of your first pet?</option>
                </select>
            </label>
            
            <input type="text" id="securityAnswer" placeholder="Answer" className="input"
                ref={(c) => securityAnswer = c} />
            <div id="bump" className="buffer"><span id="registerResult" className = "error">{message}</span></div> 
            <input type="submit" id="registerButton" value = "Register" className="registerbutton"
            onClick={doRegister} />
        </form>

        <input type="button" id="loginButton" className="loginbutton" value="Login" 
                onClick={goLogin}/>
        <div id="bump" className="bottomBuffer"></div> 
     </div>
    );
};

export default Register;
