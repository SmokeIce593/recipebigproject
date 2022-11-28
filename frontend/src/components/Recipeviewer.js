import React, { useState } from 'react';
import './recipeviewer.css'

function Recipeviewer()
{
    var _ud = localStorage.getItem('recipe_data');
    var ud = JSON.parse(_ud);
    var direction = ud.direction;
    var ingredient = ud.ingredient;
    var recipeall = ud.recipe;
    var tag = ud.tag;

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
   
   var recipe;
   var ingredients;
   var tags;
   let loadFlag = 0;

   window.addEventListener('load', async function loadRecipe(){
    if(loadFlag == 0){		//for some reason the event kept firing 3 times and I couldn't figure out how to stop it, 
                            //loadFlag is a dirty solution to prevent that
        document.getElementById("ingredientslist").innerText = ingredient[0]["ingredient"];
        document.getElementById("directionslist").innerText = direction[0]["directions"];
        document.getElementById("tagslist").innerText = tag[0]["tagname"];
}
    loadFlag++;
});

   return(
        <div id="recipeviewerDiv" className="displayregion">
            <div id="recipeName" className="recipeHeader">{recipeName}</div>
            <div id="line"><hr /></div>
            <div id="description" className="description">{description}</div>
            <div id="line"><hr /></div>
            <div id="columns" className="col-container">
                <div id="leftcol" className="col-child1">
                    <div id="text1" className="smallHeader">Directions</div> 
                    <div id="directionslist" className="recipelist">{recipe}</div>
                </div>
                <div id="rightcol" className="col-child2">
                    <div id="text1" className="smallHeader">Ingredients</div> 
                    <div id="ingredientslist" defaultValue={ingredients} className="recipelist"></div>
                </div>
            </div>
            <br></br>
            <div id="line"><hr /></div>
            <div id="text3" className="smallHeader">Tags</div> 
            <div id="tagslist" className="tags">{tags}</div>
        </div>
   );
};

export default Recipeviewer;
