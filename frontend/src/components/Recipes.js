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

   
   var recipeID = 'f253fd79-8478-4309-9317-8eef436726f4';
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

   return(
        <div id="recipesDiv" className="displayregion">
            <input type="button" id="deleteButton" className="deletebuttonfield" value="Delete" 
                onClick={goDelete}/>
                <br />


        </div>
   );
};

export default Recipes;
