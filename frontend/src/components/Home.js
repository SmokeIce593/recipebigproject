import React, { useState } from 'react';
import './home.css'

const glass = new URL("/public/glassicon.png",import.meta.url);
const logo = new URL("/public/logo.png",import.meta.url);

function Home()
{

    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud.id;
    var firstName = ud.firstName;
    var lastName = ud.lastName;

    const doSearch = async event=>
    {
        window.location.href = '/home';
    }

   return(
        <div id="homeDiv">
            <div id="userName" className="user">Hi {firstName} {lastName}</div>
            <img src={logo} alt="logo" className="logo"></img>
            
            <div id="search" className="Search">
                <input type="text" id="search" placeholder="Search" className="searchBox"></input>
                <button type="submit" id="searchBut" class="searchButton" onClick={doSearch}>
                    <img src={glass} alt="glass icon" width="40" className="glassimg"></img></button>
            </div>


        </div>
   );
};

export default Home;
