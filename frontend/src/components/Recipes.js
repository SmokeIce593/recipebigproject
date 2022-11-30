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

   //var recipeID = '70730eaf-30a4-45cd-9191-63684c646a55';
   var recipeID;
   function goDelete(recipeID)
   {
      return async function()
      {
         var obj = {id: recipeID};
         var js = JSON.stringify(obj);
         try
         {    
            const response = await fetch(buildPath('api/deleterecipe'),
                  {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            window.location.href = '/recipes';
            //alert(res.error);
         }
         catch(e)
         {
            alert(e.toString());
            return;
         }    
      }
   };

   function goView(recipeID)
   {
      return async function()
      {
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

            if(res.error != null)
            {
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

   /*function goEdit(recipeID)
   {
      console.log("entered goEdit");
      
      return async function()
      {
         console.log("entered goEdit's return function");

         var obj = {recipeID: recipeID};
         var js = JSON.stringify(obj);

         try
         {
            console.log("trying to connect to editrecipe api");
            const response = await fetch(buildPath('api/getsinglerecipe'),
                  {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
            var res = JSON.parse(await response.text());
            console.log(res);
            var direction = res.directions;
            var ingredient = res.ingredients;
            var recipe = res.recipe;
            var tag = res.tags;
            var recipe = {recipe: recipe, direction: direction, ingredient: ingredient, tag: tag};
            localStorage.setItem('recipe_data', JSON.stringify(recipe));

            if(res.error != null)
            {
               console.log("res.error != null");
               window.location.href = '/edit';
            }
         }
         catch(e)
         {
            alert(e.toString());
            return;
         }  
      }  
   };*/

   async function getMyRecipes()
   {
      let user_data = JSON.parse(localStorage.getItem("user_data"));
      //console.log(user_data);
      let userID = user_data.id;
      //console.log(userID);
      var obj = {userID: userID};
      var js = JSON.stringify(obj);
      try
      {    
         const response = await fetch(buildPath('api/myrecipes'),
               {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
         
         var res = JSON.parse(await response.text());
         //alert(res.filter[0]["recipe"]);
         if(res.error != null){
            //console.log(res.filter);
            return res.filter;
         }
      }
      catch(e)
      {
         alert(e.toString());
         return;
      }    
   };

   window.addEventListener('load', async function loadRecipes(){
		if(loadFlag == 0){		//for some reason the event kept firing 3 times and I couldn't figure out how to stop it, 
			loadFlag++;			   //loadFlag is a dirty solution to prevent that
         
         var myRecipes = await getMyRecipes();
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
						//listItem.onclick = goView(recipeID);			//goes to specified recipe on click, probably needs a function
					let recipeTitle = document.createElement("div");
						recipeTitle.className = "recipeTitle";
					let recipeDescription = document.createElement("div");
						recipeDescription.className = "recipeDescription";
					/*let recipeTags = document.createElement("div");
						recipeTags.className = "recipeTags";*/
					/*let editBTN = this.document.createElement("button");
						editBTN.type = "button";
						editBTN.className = "editButton";
						editBTN.innerHTML = "Edit";*/
						//editBTN.onclick = goEdit(recipeID);
					let deleteBTN = this.document.createElement("button");
						deleteBTN.type = "button";
						deleteBTN.className = "deleteButton";
						deleteBTN.innerHTML = "Delete";
						deleteBTN.onclick = goDelete(recipeID);
					let title = myRecipes[i]["recipe"];				//place title here
					let dscrp = myRecipes[i]["text_recipe"];		//place description here
					//let tags = "Recipe Tags";				//place tags here. If tags are an array, maybe add the array 
															         //here and loop to list all elements in a comma separated-list
					recipeTitle.innerHTML = title;			//I will add overflow prevention to all of these later on.
					recipeTitle.onclick = goView(recipeID);
               recipeDescription.innerHTML = dscrp;
					//recipeTags.innerHTML = "Tags: " + tags;
					//append all created items into list
					mainDiv.appendChild(listItem);
					listItem.appendChild(recipeTitle);
               //listItem.appendChild(editBTN);
               listItem.appendChild(deleteBTN);
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

   var _ud = localStorage.getItem('user_data');
   var ud = JSON.parse(_ud);
   var firstName = ud.firstName;
    return(
		<body>
         <p id="title"  className="recipesTitle">{firstName}'s Recipes</p>
			<div id="recipesDiv" className="displayregion">
				<p id="defaultMsg" className="defaultMsg">No recipes found. Go to Create to start making new recipes!</p>
			</div>
			<div>
				<button type="button" id="previous" className="previousButton"  onClick={previousPage()}>Previous Page</button>
				<button type="button" id="next" className="nextButton" onClick={nextPage()}>Next Page</button>
			</div>
		</body>
   );
};

export default Recipes;
