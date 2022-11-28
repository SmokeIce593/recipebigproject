import React, { useState } from 'react';
import './recipeviewer.css'

let loadFlag = 0;

function Recipeviewer()
{
    var _ud = localStorage.getItem('recipe_data');
    var ud = JSON.parse(_ud);
    var direction = ud.direction;
    var ingredient = ud.ingredient;
    var recipeall = ud.recipe;
    var tag = ud.tag;
    /*console.log(direction);
    console.log(ingredient);
    console.log(tag);*/

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

   window.addEventListener('load', async function loadRecipe(){
    if(loadFlag == 0){		//for some reason the event kept firing 3 times and I couldn't figure out how to stop it, 
        loadFlag++;         //loadFlag is a dirty solution to prevent that

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
            listIngredient.innerText = ingredient[i]["ingredient"];
            mainDiv1.appendChild(listIngredient);
            listIngredient.appendChild(ingredientItem);
        }
        for (let i = 0; i < directionCount; i++) {
            let listDirection = document.createElement("tr");
            listDirection.className = "tableClass"
            listDirection.id = "directionElement"
            listDirection.innerText = direction[i]["directions"];
            mainDiv2.appendChild(listDirection);
            listDirection.appendChild(directionItem);
        }
        for (let i = 0; i < tagCount; i++) {
            let listTag = document.createElement("tr");
            listTag.className = "tableClass"
            listTag.id = "tagElement"
            listTag.innerText = tag[i]["tagname"];
            mainDiv3.appendChild(listTag);
            listTag.appendChild(tagItem);
        }
}
});

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
