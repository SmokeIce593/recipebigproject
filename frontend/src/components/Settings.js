import React, { useState } from 'react';
import './settings.css'

function Settings()
{
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud.id;
    var firstName = ud.firstName;
    var lastName = ud.lastName;
    var username = ud.login;
    var password = ud.password;
    var question = ud.securityQuestion;
    var answer = ud.securityAnswer;
    var email = ud.email;
    
    const doSave = async event=>
    {
        window.location.href = '/settings';
    }

   return(
        <div id="settingsDiv" className="displayregion">
            <form>
                <div id="settingsheader" className="pageheader">
                    Account Settings
                </div>
                <div id="line"><hr /></div>
                <div id="logininfo" className="changeinfo">
                    <span id="info1" className="infotext">Current username: {username}</span>
                    <br></br>
                    <span id="info1new" className="infotext">New username: </span>
                    <input type="text" id="newlogin" placeholder="Username" defaultValue={username} className="inputbox"></input>
                </div>

                <div id="passwordinfo" className="changeinfo">
                    <span id="info2" className="infotext">Current password: {password}</span>
                    <br></br>
                    <span id="info2new" className="infotext">New password: </span>
                    <input type="text" id="newpassword" placeholder="Password" defaultValue={password} className="inputbox"></input>
                </div>

                <div id="emailinfo" className="changeinfo">
                    <span id="info5" className="infotext">Current email: {email}</span>
                    <br></br>
                    <span id="info5new" className="infotext">New email: </span>
                    <input type="text" id="newemail" placeholder="Email" defaultValue={email} className="inputbox"></input>
                </div>

                <div id="firstinfo" className="changeinfo">
                    <span id="info6" className="infotext">Current first name: {firstName}</span>
                    <br></br>
                    <span id="info6new" className="infotext">New first name: </span>
                    <input type="text" id="newfirst" placeholder="First Name" defaultValue={firstName} className="inputbox"></input>
                </div>

                <div id="lastinfo" className="changeinfo">
                    <span id="info7" className="infotext">Current last name: {lastName}</span>
                    <br></br>
                    <span id="info7new" className="infotext">New last name: </span>
                    <input type="text" id="newlast" placeholder="Last Name" defaultValue={lastName} className="inputbox"></input>
                </div>

                <div id="questioninfo" className="changeinfo">
                    <span id="info3" className="infotext">Current security question: {question}</span>
                    <br></br>
                    <span id="info3new" className="infotext">New security question: </span>
                    <select id="newquestion" name="securityQuestion" defaultValue={question} className="inputbox"
                        ref={(c) => question = c}>
                        <option value="0">What is your father's middle name?</option>
                        <option value="1">What was the name of your high school?</option>
                        <option value="2">What is the name of your first pet?</option>
                    </select>
                </div>

                <div id="answerinfo" className="changeinfo">
                    <span id="info4" className="infotext">Current answer: {answer}</span>
                    <br></br>
                    <span id="info4new" className="infotext">New answer: </span>
                    <input type="text" id="newanswer" placeholder="Answer" defaultValue={answer} className="inputbox"></input>
                </div>

                <input type="submit" id="savebuton" value = "Save Changes" className="savebutton"
                onClick={doSave} />
            </form>
        </div>
   );
};

export default Settings;
