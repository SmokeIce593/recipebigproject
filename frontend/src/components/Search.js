import React, { useState } from 'react';
import './recipes.css'

let recipeCount = 0;
let loadFlag = 0;

function nextPage(pageCount){
	pageCount++;

}

function previousPage(pageCount){
	pageCount--;

}

function Search()
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

   var recipeID;
   function goDelete(recipeID){
   return async function(){
   {
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
  }}
   };

   function goView(recipeID)
   {
      return async function(){
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
            window.location.href = '/recipeviewer';
         }
      }
      catch(e)
      {
         alert(e.toString());
         return;
      }
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

   async function searchRecipes(){

   }

   window.addEventListener('load', async function loadRecipes(){
		if(loadFlag == 0){		//for some reason the event kept firing 3 times and I couldn't figure out how to stop it, 
			loadFlag++;			   //loadFlag is a dirty solution to prevent that
         
         var myRecipes = await searchRecipes();
			recipeCount = myRecipes.length;
         console.log(myRecipes);

         if(recipeCount == 0){	//if no recipes, display this message
				document.getElementById("defaultMsg").style.display = "block";
				document.getElementById("defaultMsg").style.visibility = "visible";
			}

			else{		//else, load list of recipes to choose from
				let listCount = 0;
				let pageCount = 0;
				let mainDiv = document.createElement("table");
            mainDiv.className = "listTable";
				this.document.getElementById("recipesDiv").appendChild(mainDiv);
				for(let i = 0; i < recipeCount /*&& i < 10*/; i++){		//append a listItem per recipe listing
																	//max of 10 recipes per page, if more load to next page
               recipeID = myRecipes[i]["id"];
					let listItem = document.createElement("tr");
						listItem.className = "recipeBox";
						listItem.onclick = goView(recipeID);			//goes to specified recipe on click, probably needs a function
					let recipeTitle = document.createElement("div");
						recipeTitle.className = "recipeTitle";
					let recipeDescription = document.createElement("div");
						recipeDescription.className = "recipeDescription";
					let deleteBTN = this.document.createElement("button");
					let title = myRecipes[i]["recipe"];				//place title here
					let dscrp = myRecipes[i]["text_recipe"];		//place description here
					//let tags = "Recipe Tags";				//place tags here. If tags are an array, maybe add the array 
															         //here and loop to list all elements in a comma separated-list
					recipeTitle.innerHTML = title;			//I will add overflow prevention to all of these later on.
					recipeDescription.innerHTML = dscrp;
					//recipeTags.innerHTML = "Tags: " + tags;
					//append all created items into list
					mainDiv.appendChild(listItem);
					listItem.appendChild(recipeTitle);
					listItem.appendChild(recipeDescription);
					//listItem.appendChild(recipeTags);
					listCount++;
					/*if(listCount == 10){
						listCount = 0;
						this.document.getElementById("next").style.display = "block";
						this.document.getElementById("next").style.visibility = "visible";
					}
					/*make the "previous" button visible when scrolling to next page(s)
					if(pageCount > 1){
						this.document.getElementById("previous").style.display = "block";
						this.document.getElementById("previous").style.visibility = "visible";
					}*/
				}
			}
		}
	});

    return(
		<body>
			<div id="recipesDiv" className="displayregion">
				<p id="defaultMsg" className="defaultMsg">No recipes found!</p>
			</div>
			<div>
				<button type="button" id="previous" className="previousButton"  onClick={previousPage()}>Previous Page</button>
				<button type="button" id="next" className="nextButton" onClick={nextPage()}>Next Page</button>
			</div>
		</body>
   );
};

export default Search;
