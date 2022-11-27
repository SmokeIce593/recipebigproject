import React, { useState } from 'react';
import { render } from "react-dom";
import { renderMatches } from 'react-router-dom';
import './recipeviewer.css'

function Recipeviewer()
{
    var _ud = localStorage.getItem('recipe_data');
    var ud = JSON.parse(_ud);
    var directions = ud.direction;
    var ingredients = ud.ingredient;
    var recipeall = ud.recipe;
    var tags = ud.tag;

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

   var recipeName = recipeall["recipe"];
   var description = recipeall["text_recipe"];
   
   const listdirections = directions.map((item, index) => <div key={index}>{item}</div>);
   const listingredients = ingredients.map((item, index) => <div key={index}>{item}</div>);
   const listtags = tags.map((item, index) => <div key={index}>{item}</div>);

   return(
        <div id="recipeviewerDiv" className="displayregion">
            <div id="recipeName" className="recipeHeader">{recipeName}</div>
            <div id="line"><hr /></div>
            <div id="description" className="description">{description}</div>
            <div id="line"><hr /></div>
            <div id="columns" className="col-container">
                <div id="leftcol" className="col-child">
                    <div id="text1" className="smallHeader">Directions</div> 
                    <div id="directionslist" className="recipelist">
                        {listdirections}
                    </div>
                </div>
                <div id="rightcol" className="col-child">
                    <div id="text1" className="smallHeader">Ingredients</div> 
                    <div id="ingredientslist" className="recipelist"> 
                        {listingredients}
                    </div>
                </div>
            </div>
            <div id="line"><hr /></div>
            <br></br>
            <div id="text3" className="smallHeader">Tags</div> 
            <div id="tagslist" className="tags"> 
                {listtags}
            </div>
        </div>
   );
};

export default Recipeviewer;
