import React, { useState } from 'react';
import './home.css'

const glass = new URL("/public/glassicon.png",import.meta.url);
const logo = new URL("/public/logo.png",import.meta.url);

function Home()
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

    const doSearch = async event=>
    {
      if(document.getElementById('search').value != ""){
        let searchQuery = document.getElementById('search').value;
        localStorage.setItem("query", searchQuery);
        window.location.href = '/search';
      }
      else
         return;
   }

   return(
      <body>
         <div id="homeDiv">
            <div id="userName" className="user">Hi {firstName} {lastName}</div>
            <img src={logo} alt="logo" className="logohome"></img>
            <form>
            <div id="searchBox" className="Search">
                <input type="text" id="search" placeholder="Search" className="searchBox"></input>
                <button type="button" id="searchBut" class="searchButton" onClick={doSearch}>
                    <img src={glass} alt="glass icon" width="40" className="glassimg"></img></button>
            </div>
            </form>
         </div>
      </body>
   );
};

export default Home;
