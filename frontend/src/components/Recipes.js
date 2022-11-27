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
	window.addEventListener('load', async function loadRecipes(){
		if(loadFlag == 0){		//for some reason the event kept firing 3 times and I couldn't figure out how to stop it, 
								//loadFlag is a dirty solution to prevent that
			recipeCount = 10;	//delete this, recipe count should respond to APIand set to respond to API

			if(recipeCount == 0){	//if no recipes, display this message
				document.getElementById("defaultMsg").style.display = "block";
				document.getElementById("defaultMsg").style.visibility = "visible";
			}

			else{		//else, load list of recipes to choose from
				let listCount = 0;
				let pageCount = 0;
				let mainDiv = document.createElement("table");
				this.document.getElementById("recipesDiv").appendChild(mainDiv);
				for(let i = 0; i < recipeCount && i < 10; i++){		//append a listItem per recipe listing
																	//max of 10 recipes per page, if more load to next page
					let listItem = document.createElement("tr");
						listItem.className = "recipeBox";
						//listItem.onclick = {};			//goes to specified recipe on click, probably needs a function
					let recipeTitle = document.createElement("div");
						recipeTitle.className = "recipeTitle";
					let recipeDescription = document.createElement("div");
						recipeDescription.className = "recipeDescription";
					let recipeTags = document.createElement("div");
						recipeTags.className = "recipeTags";
					let editBTN = this.document.createElement("button");
						editBTN.type = "button";
						editBTN.className = "editButton";
						editBTN.innerHTML = "Edit";
						//editBTN.onclick = " ";
					let deleteBTN = this.document.createElement("button");
						deleteBTN.type = "button";
						deleteBTN.className = "deleteButton";
						deleteBTN.innerHTML = "Delete";
						//deleteBTN.onclick = " ";
					let title = "Recipe Title";				//place title here
					let dscrp = "Recipe Description";		//place description here
					let tags = "Recipe Tags";				//place tags here. If tags are an array, maybe add the array 
															//here and loop to list all elements in a comma separated-list
					recipeTitle.innerHTML = title;			//I will add overflow prevention to all of these later on.
					recipeDescription.innerHTML = dscrp;
					recipeTags.innerHTML = "Tags: " + tags;
					//append all created items into list
					mainDiv.appendChild(listItem);
					listItem.appendChild(deleteBTN);
					listItem.appendChild(editBTN);
					listItem.appendChild(recipeTitle);
					listItem.appendChild(recipeDescription);
					listItem.appendChild(recipeTags);
					listCount++;
					if(listCount == 10){
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
			loadFlag++;
		}
	});

    return(
		<body>
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
