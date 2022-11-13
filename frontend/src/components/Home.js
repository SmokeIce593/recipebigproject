import React, { useState } from 'react';
import './home.css'

const logout = new URL("/public/logouticon.png",import.meta.url);
const bread = new URL("/public/breadicon.png",import.meta.url);
const home = new URL("/public/homeicon.png",import.meta.url);
const star = new URL("/public/staricon.png",import.meta.url);
const glass = new URL("/public/glassicon.png",import.meta.url);
const logo = new URL("/public/logo.png",import.meta.url);

function Home()
{

    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud.id;
    var firstName = ud.firstName;
    var lastName = ud.lastName;

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

    const doLogout = event => 
    {
	    event.preventDefault();

        localStorage.removeItem("user_data")
        window.location.href = '/';

    }; 

    const goHome = async event=>
    {
        window.location.href = '/home';
    }

    const goRecipes = async event=>
    {
        window.location.href = '/home';
    }

    const goCreate = async event=>
    {
        window.location.href = '/home';
    }

    const doSearch = async event=>
    {
        window.location.href = '/home';
    }

   return(
        <div id="homeDiv">
            <div id="searchBar" className="searchBar">
                <button type="submit" id="homeBut" class="barButton" onClick={goHome}>
                    <img src={home} alt="Home icon" width="20"></img> Home</button>
                <button type="submit" id="recipesBut" class="barButton" onClick={goRecipes}>
                    <img src={bread} alt="Bread icon" width="20"></img> Recipes</button>
                <button type="submit" id="createBut" class="barButton" onClick={goCreate}>
                    <img src={star} alt="Star icon" width="20"></img> Create</button>
                <button type="submit" id="logoutBut" class="barButton" onClick={doLogout}>
                    <img src={logout} alt="Logout icon" width="20"></img> Log out</button>
            </div>

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
