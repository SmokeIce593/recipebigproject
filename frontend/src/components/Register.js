import React, { useState } from 'react';
import { Link } from "react-router-dom";
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

        try
        {    
//            const response = await fetch('http://localhost:5000/api/login',
            const response = await fetch(buildPath('api/login'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            if( res.id <= 0 )
            {
                setMessage('Register failed');
            }
            else
            {
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

    return(
      <div id="registerDiv">
        <form onSubmit={doRegister}>
        <span id="inner-title">Create an account</span><br />
        <input type="text" id="firstName" placeholder="First Name" 
            ref={(c) => firstName = c} /><br />
        <input type="text" id="lastName" placeholder="Last Name" 
            ref={(c) => lastName = c} /><br />
        <input type="text" id="email" placeholder="Email" 
            ref={(c) => email = c} /><br />
        <input type="text" id="loginName" placeholder="Username" 
            ref={(c) => loginName = c} /><br />
        <input type="password" id="loginPassword" placeholder="Password" 
            ref={(c) => loginPassword = c} /><br />
        <label>
            Security question:
            <select id="securityQuestion" name="securityQuestion"
            ref={(c) => securityQuestion = c}>
                <option value="1">What is your father's middle name?</option>
                <option value="2">What was the name of your high school?</option>
                <option value="3">What is the name of your first pet?</option>
            </select>
        </label>
        
        <input type="text" id="securityAnswer" placeholder="Answer" 
            ref={(c) => securityAnswer = c} /><br />
        <input type="submit" id="registerButton" value = "Register"
          onClick={doRegister} />
        </form>
        <span id="registerResult">{message}</span>
        <Link to="/login">Log in</Link>
     </div>
    );
};

export default Register;
