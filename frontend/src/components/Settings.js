import React, { useState } from 'react';
import './settings.css'

function Settings()
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
    var ud = JSON.parse(_ud);
    var userId = ud.id;
    var firstName = ud.firstName;
    var lastName = ud.lastName;
    var username = ud.username;
    var password = ud.password;
    var question = ud.securityquestion;
    var answer = ud.securityanswer;
    var email = ud.email;
    const [message,setMessage] = useState('');
    /* can't get this shid to work -polina
    const [pwConfirmMessage,setPwConfirmMessage] = useState('');

    var new_password = document.getElementById("newpassword");
    var confirm_password = document.getElementById("passwordconfirm");

    function checkPasswordMatch()
    {
        if(new_password.value != confirm_password.value)
        {
            setPwConfirmMessage("Passwords do not match");
            return false;
        }
        else
        {
            setPwConfirmMessage('');
            return true;
        }
    } */
    
    const doSave = async event=>
    {
        event.preventDefault();
        //alert(email);
        var obj = {id: userId, login:username.value,password:password.value,email:email,firstname:firstName.value,lastname:lastName.value,securityquestion:question,securityanswer:answer};
        var js = JSON.stringify(obj);

        //alert(password.value);
        var passwordcode = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        //var emailcode = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if(!obj.password.match(passwordcode) && password.value != ''){
            setMessage("Your password does not meet requirements: Between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.")
            return;
        }

        /*if(!obj.email.match(emailcode)){
            setMessage("Please enter a valid email.")
            return;
        }*/

        try
        {    
            const response = await fetch(buildPath('api/updateinformation'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            if( res.error !== "")
            {
                setMessage(res.error);
            }
            else
            {
                var user = {firstName:res.firstName,lastName:res.lastName,id:res.id,email:res.email, username:res.username};
                localStorage.setItem('user_data', JSON.stringify(user));
                setMessage('');
                window.location.href = '/settings';
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
    }

   return(
        <div id="settingsDiv" className="displayregion">
            <form>
                <div id="settingsheader" className="pageheader">
                    Account Settings
                </div>
                {/*<div id="line"><hr /></div> */}
                <div id="logininfo" className="changeinfo">
                    <span id="info1new" className="infotext">USERNAME</span>
                    <input type="text" id="newlogin" defaultValue={username} ref={(c) => username = c} className="inputbox"></input>
                </div>

                <div id="passwordinfo" className="changeinfo">
                    <span id="info2" className="infotext">PASSWORD</span>
                    {/*<br></br>
                    <span id="info2new" className="infotext">New password </span>*/}
                    <input type="password" id="newpassword" placeholder="New password (leave empty for no change)" defaultValue={password} ref={(c) => password = c} className="inputbox" required></input>
                    {/* can't get this shid to work -polina
                    <input type="password" id="passwordconfirm" placeholder="Confirm password" defaultValue={password} ref={(c) => password = c} className="inputbox" required></input>
                    <div id="bump" className="buffer"><span id="registerResult" className = "error">{pwConfirmMessage}</span></div> */}
                </div>
                
                <div id="firstinfo" className="changeinfo">
                    <span id="info6new" className="infotext">FIRST NAME</span>
                    <input type="text" id="newfirst" defaultValue={firstName} ref={(c) => firstName = c} className="inputbox"></input>
                </div>

                <div id="lastinfo" className="changeinfo">
                    <span id="info7new" className="infotext">LAST NAME</span>
                    <input type="text" id="newlast" defaultValue={lastName} ref={(c) => lastName = c} className="inputbox"></input>
                </div>
                <div id="bump" className="buffer"><span id="registerResult" className = "error">{message}</span></div> 
                <input type="submit" id="savebuton" value = "Save Changes" className="savebutton"
                onClick={doSave} />
            </form>
        </div>
   );
};

export default Settings;
