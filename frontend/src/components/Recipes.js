import React, { useState } from 'react';
import './recipes.css'

function Recipes()
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

   
   var recipeID = 'c2d0d25c-45d4-4154-9e07-59a5bbe3411b';
   const goDelete= async event => 
   {
      event.preventDefault();

      var obj = {id: recipeID};
      var js = JSON.stringify(obj);

      try
      {    
         const response = await fetch(buildPath('api/deleterecipe'),
               {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

         var res = JSON.parse(await response.text());
         window.location.href = '/recipes';
         alert(res.error);
      }
      catch(e)
      {
         alert(e.toString());
         return;
      }    
   };

   const goView= async event => 
   {
      event.preventDefault();

      var obj = {recipeID: recipeID};
      var js = JSON.stringify(obj);

      try
      {    
         const response = await fetch(buildPath('api/getsinglerecipe'),
               {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

         var res = JSON.parse(await response.text());
         var direction = res.directions;
         var ingredient = res.ingredients;
         var recipe = res.recipe;
         var tag = res.tags;
         //alert(direction[0]["directions"]);
         //alert(ingredient[0]["ingredient"]);
         //alert(tag[0]["tagname"]);
         //alert(recipe["recipe"]);
         var recipe = {recipe: recipe, direction: direction, ingredient: ingredient, tag: tag};
         localStorage.setItem('recipe_data', JSON.stringify(recipe));

         if(res.error != null){
            window.location.href = '/recipeviewer';
         }
      }
      catch(e)
      {
         alert(e.toString());
         return;
      }    
   };

   const goEdit= async event => 
   {
      event.preventDefault();

      var obj = {recipeID: recipeID};
      var js = JSON.stringify(obj);

      try
      {    
         const response = await fetch(buildPath('api/getsinglerecipe'),
               {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

         var res = JSON.parse(await response.text());
         var direction = res.directions;
         var ingredient = res.ingredients;
         var recipe = res.recipe;
         var tag = res.tags;
         var recipe = {recipe: recipe, direction: direction, ingredient: ingredient, tag: tag};
         localStorage.setItem('recipe_data', JSON.stringify(recipe));

         if(res.error != null){
            window.location.href = '/edit';
         }
      }
      catch(e)
      {
         alert(e.toString());
         return;
      }    
   };

   

   return(
    <div>
        <div id="recipesDiv" className="displayregion">
            <input type="button" id="deleteButton" className="deletebuttonfield" value="Delete" 
                onClick={goDelete}/>
                <br />
        </div>
        <div id="recipesDiv" className="displayregion">
            <input type="button" id="viewButton" className="viewbuttonfield" value="View" 
                onClick={goView}/>
                <br />
        </div>
        <div id="recipesDiv" className="displayregion">
            <input type="button" id="editButton" className="editbuttonfield" value="Edit" 
                onClick={goEdit}/>
                <br />
        </div>
        
    </div>
        
   );
};

export default Recipes;
