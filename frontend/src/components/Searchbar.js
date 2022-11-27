import React, { useState } from 'react';
import './searchbar.css'

const logout = new URL("/public/logouticon.png",import.meta.url);
const bread = new URL("/public/breadicon.png",import.meta.url);
const home = new URL("/public/homeicon.png",import.meta.url);
const star = new URL("/public/staricon.png",import.meta.url);
const gear = new URL("/public/gearicon.png",import.meta.url);

function Searchbar()
{
    const doLogout = event => 
    {
	    event.preventDefault();

        localStorage.removeItem("user_data");
        window.location.href = '/';

    }; 

    const goHome = async event=>
    {
        window.location.href = '/home';
    }

    const goRecipes = async event=>
    {
        window.location.href = '/recipes';
    }

    const goCreate = async event=>
    {
        window.location.href = '/create';
    }

    const goSettings = async event=>
    {
        window.location.href = '/settings';
    }

   return(
        <div id="searchBar" className="searchBar">
            <button type="submit" id="homeBut" class="barButton" onClick={goHome}>
                <img src={home} alt="Home icon" width="20"></img> Home</button>
            <button type="submit" id="recipesBut" class="barButton" onClick={goRecipes}>
                <img src={bread} alt="Bread icon" width="20"></img> My Recipes</button>
            <button type="submit" id="createBut" class="barButton" onClick={goCreate}>
                <img src={star} alt="Star icon" width="20"></img> Create</button>
            <button type="submit" id="logoutBut" class="barButton" onClick={goSettings}>
                <img src={gear} alt="Gear icon" width="20"></img> Account</button>
            <button type="submit" id="logoutBut" class="barButton" onClick={doLogout}>
                <img src={logout} alt="Logout icon" width="20"></img> Log out</button>
        </div>
   );
};

export default Searchbar;