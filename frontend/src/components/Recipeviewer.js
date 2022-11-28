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

        var ingredientCount = ingredient.length;
        var directionCount = direction.length;
        var tagCount = tag.length;

        var mainDiv1 = document.createElement("table");
        mainDiv1.className = "listIngredientTable";
        mainDiv1.id = "ingredienttable";

        var mainDiv2 = document.createElement("table");
        mainDiv2.className = "listDirectionTable";
        mainDiv2.id = "directiontable";

        var mainDiv3 = document.createElement("table");
        mainDiv3.className = "listTagTable";
        mainDiv3.id = "tagtable";

        this.document.getElementById("ingredientslist").appendChild(mainDiv1);
        this.document.getElementById("directionslist").appendChild(mainDiv2);
        this.document.getElementById("tagslist").appendChild(mainDiv3);

        for (let i = 0; i < ingredientCount; i++) {
            let listIngredient = document.createElement("tr");
            listIngredient.className = "tableClass"
            listIngredient.id = "ingredientElement"
            let ingredientItem = document.createElement("div");
            ingredientItem.className = "tableClass";
            ingredientItem.id = "ingredientItem"
            document.getElementById("ingredientItem").innerText = ingredient[i]["ingredient"];
            mainDiv1.appendChild(listIngredient);
            listIngredient.appendChild(ingredientItem);
        }
        for (let i = 0; i < directionCount; i++) {
            let listDirection = document.createElement("tr");
            listDirection.className = "tableClass"
            listDirection.id = "directionElement"
            let directionItem = document.createElement("div");
            directionItem.className = "tableClass";
            directionItem.id = "directionItem"
            document.getElementById("directionItem").innerText = direction[i]["directions"];
            mainDiv2.appendChild(listDirection);
            listDirection.appendChild(directionItem);
        }
        for (let i = 0; i < tagCount; i++) {
            let listTag = document.createElement("tr");
            listTag.className = "tableClass"
            listTag.id = "tagElement"
            let tagItem = document.createElement("div");
            tagItem.className = "tableClass";
            tagItem.id = "tagItem"
            document.getElementById("tagItem").innerText = tag[i]["tags"];
            mainDiv3.appendChild(listTag);
            listTag.appendChild(tagItem);
        }
}
    loadFlag++;
});

// window.addEventListener('load', async function loadRecipes(){
//     if(loadFlag == 0){		//for some reason the event kept firing 3 times and I couldn't figure out how to stop it, 
//         loadFlag++;			   //loadFlag is a dirty solution to prevent that
     
//      var myIngredients = await getMyRecipes();
//         ingredientsCount = myIngredients.length;
//      console.log(myRecipes);

//      if(recipeCount == 0){	//if no recipes, display this message
//             document.getElementById("defaultMsg").style.display = "block";
//             document.getElementById("defaultMsg").style.visibility = "visible";
//         }

//         else{		//else, load list of recipes to choose from
//             let listCount = 0;
//             let pageCount = 0;
//             let mainDiv = document.createElement("table");
//         mainDiv.className = "listTable";
//             this.document.getElementById("IngredientsDiv").appendChild(mainDiv);
//             for(let i = 0; i < recipeCount /*&& i < 10*/; i++){		//append a listItem per recipe listing
//                                                                 //max of 10 recipes per page, if more load to next page
//            recipeID = myRecipes[i]["id"];
//                 let listItem = document.createElement("tr");
//                     listItem.className = "recipeBox";
//                     listItem.onclick = goView(recipeID);			//goes to specified recipe on click, probably needs a function
//                 let recipeTitle = document.createElement("div");
//                     recipeTitle.className = "recipeTitle";
//                 let recipeDescription = document.createElement("div");
//                     recipeDescription.className = "recipeDescription";
//                 /*let recipeTags = document.createElement("div");
//                     recipeTags.className = "recipeTags";*/
//                 /*let editBTN = this.document.createElement("button");
//                     editBTN.type = "button";
//                     editBTN.className = "editButton";
//                     editBTN.innerHTML = "Edit";
//                     editBTN.onclick = {goEdit};*/
//                 let title = myRecipes[i]["recipe"];				//place title here
//                 let dscrp = myRecipes[i]["text_recipe"];		//place description here
//                 //let tags = "Recipe Tags";				//place tags here. If tags are an array, maybe add the array 
//                                                                  //here and loop to list all elements in a comma separated-list
//                 recipeTitle.innerHTML = title;			//I will add overflow prevention to all of these later on.
//                 recipeDescription.innerHTML = dscrp;
//                 //recipeTags.innerHTML = "Tags: " + tags;
//                 //append all created items into list
//                 mainDiv.appendChild(listItem);
//                 listItem.appendChild(deleteBTN);
//                 //listItem.appendChild(editBTN);
//                 listItem.appendChild(recipeTitle);
//                 listItem.appendChild(recipeDescription);
//                 //listItem.appendChild(recipeTags);
//                 listCount++;
//             }
//         }
//     }
// });

   return(
        <div id="recipeviewerDiv" className="displayregionviewer">
            <div id="recipeName" className="recipeHeader">{recipeName}</div>
            <div id="line"><hr /></div>
            <div id="description" className="description">{description}</div>
            <br></br>
            <div id="columns" className="col-container">
                <div id="leftcol" className="col-child1">
                    <div id="text1" className="smallHeader">Directions</div> 
                    <div id="directionslist" className="directionsstyle">{recipe}</div>
                </div>
                <div id="rightcol" className="col-child2">
                    <div id="text1" className="smallHeader">Ingredients</div> 
                    <div id="ingredientslist" defaultValue={ingredients} className="ingredientsstyle"></div>
                </div>
            </div>
            <div id="line2"><br></br><hr/></div>
            <div id="text3" className="smallHeader">Tags</div> 
            <div id="tagslist" className="tags">{tags}</div>
        </div>
   );
};

export default Recipeviewer;
