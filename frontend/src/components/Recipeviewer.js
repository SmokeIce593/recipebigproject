import React, { useState } from 'react';
import './recipeviewer.css'

function Recipeviewer()
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

   var recipeName = "pie";
   var recipe = "wow this sentence is going to be really long I am typing it for a test.. hey this is still going? okay imma stop typing now";
   var ingredients = "step1 step2";
   var description = "a recipe description that is very descriptive, it describes a recipe that involves cooking to make food";
   var tags = "this recipe has no gluten!";
   

   return(
        <div id="recipeviewerDiv" className="displayregion">
            <div id="recipeName" className="recipeHeader">{recipeName}</div>
            <div id="line"><hr /></div>
            <div id="description" className="description">{description}</div>
            <div id="columns" className="col-container">
                <div id="leftcol" className="col-child">
                    <div id="text1" className="smallHeader">Directions</div> 
                    <div id="recipelist" className="recipelist">{recipe}</div>
                </div>
                <div id="rightcol" className="col-child">
                    <div id="text1" className="smallHeader">Ingredients</div> 
                    <div id="ingredientslist" className="recipelist">{ingredients}</div>
                </div>
            </div>
            <div id="line"><hr /></div>
            <div id="text3" className="smallHeader">Tags</div> 
            <div id="tagslist" className="tags">{tags}</div>
        </div>
   );
};

export default Recipeviewer;