import React, { useState } from 'react';
import './home.css'

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

   return(
        <div id="homeDiv">
            <div id="searchBar" className="searchBar">
                <span>test</span><br />
            </div>
        </div>
   );
};

export default Home;
