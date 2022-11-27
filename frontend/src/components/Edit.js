import React, { useState, useEffect } from 'react';
import './edit.css'

var _ud = localStorage.getItem('recipe_data');
var ud = JSON.parse(_ud);
var direction1 = ud.direction;
var ingredient1 = ud.ingredient;
var tag1 = ud.tag;

var recipeall = ud.recipe;
var title = recipeall["recipe"];
var description = recipeall["text_recipe"];
var ingredient = [];
var direction = [];
var tag = [];

function Edit()
{

	
	const[checkedRecipe, setCheckedRecipe] = useState(false);

	const [message,setMessage] = useState('');

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

	const createRecipe = async event =>
	{
		event.preventDefault();
		var _ud = localStorage.getItem('user_data');
		var ud = JSON.parse(_ud);
		var userId = ud.id;
        var obj = {recipename:title.value,recipetext:description.value,fkuser:userId,privaterecipe:checkedRecipe,tags:tag,ingredients:ingredient,directions:direction};
        var js = JSON.stringify(obj);
		alert(ingredient[0]);
        try
        {    
            const response = await fetch(buildPath('api/saverecipe'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            if( res.error !== "")
            {
                setMessage(res.error);
            }
            else
            {
                setMessage('');
                window.location.href = '/home';
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }  
	}

	var ingNum = 0;
	const addIng = async event => {
	if(document.getElementById('ingredient').value != ""){
		var table = document.getElementById('ingredientTable');
		var info = document.getElementById('ingredient').value;
		ingredient.push(info);
		let deleteIcon = document.createElement("button");
			deleteIcon.type = "button";
			deleteIcon.innerHTML = "X";
			deleteIcon.onclick = function(){deleteIng(table, this)};
		var row = table.insertRow(ingNum);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);
		cell1.className = "indent"
		cell3.className = "deleteIcons"
		cell1.innerHTML = "&bull;";
		cell2.innerHTML = info;
		cell3.appendChild(deleteIcon);
		document.getElementById('ingredient').value = '';
		ingNum++;
		}
	}

	
	const addIngEnter = async event => {
		for(var i=0; i<ingredient.length; i++){
			var table = document.getElementById('ingredientTable');
			var info = ingredient[i]["ingredient"];
			ingredient.push(info);
			let deleteIcon = document.createElement("button");
				deleteIcon.type = "button";
				deleteIcon.innerHTML = "X";
				deleteIcon.onclick = function(){deleteIng(table, this)};
			var row = table.insertRow(ingNum);
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			var cell3 = row.insertCell(2);
			cell1.className = "indent"
			cell3.className = "deleteIcons"
			cell1.innerHTML = "&bull;";
			cell2.innerHTML = info;
			cell3.appendChild(deleteIcon);
			document.getElementById('ingredient').value = '';
			ingNum++;
		}
	}
	

	var tagNum = 0;
	const addTag = async event => {
	if(document.getElementById('tag').value != ""){
		var table = document.getElementById('tagTable');
		var info = document.getElementById('tag').value;
		tag.push(info);
		let deleteIcon = document.createElement("button");
			deleteIcon.type = "button";
			deleteIcon.innerHTML = "X";
			deleteIcon.onclick = function(){deleteTag(table, this)};
		/*let colorpicker = document.createElement("input");
			colorpicker.type = "color";
			colorpicker.value = "#ff0000";
			colorpicker.className = "colorpicker";
			colorpicker.id = "chosenColor";*/
		var row = table.insertRow(tagNum);
		var cell1 = row.insertCell(0);
		//var cell2 = row.insertCell(1);
		var cell2 = row.insertCell(1);
		cell1.className = "tag"
		cell2.className = "deleteIcons"
		cell1.innerHTML = info;
			var colors = ['FF6347','FFE4C4','7FFFD4','FF7F50','FF8C00','DA70D6','AFEEEE','FB98FB'];
			cell1.style.backgroundColor = '#' + colors[Math.floor(Math.random() * colors.length)];
		//cell2.appendChild(colorpicker);
		cell2.appendChild(deleteIcon);
		document.getElementById('tag').value = '';
		tagNum++;
		}
	}

	function deleteTag(table, row){
		var index = row.parentNode.parentNode.rowIndex;
		table.deleteRow(index);
		tag.splice(index, 1);
		tagNum--;
	}
	
	function deleteIng(table, row){
		var index = row.parentNode.parentNode.rowIndex;
		table.deleteRow(index);
		ingredient.splice(index, 1);
		ingNum--;
	}
	
	var dirNum = 0;
	const addDir = async event => {
	if(document.getElementById('direction').value != ""){
		var table = document.getElementById('directionTable');
		var info = document.getElementById('direction').value;
		direction.push(info);
		let deleteIcon = document.createElement("button");
			deleteIcon.type = "button";
			deleteIcon.innerHTML = "X";
			deleteIcon.onclick = function(){deleteDir(table, this)};
		var row = table.insertRow(dirNum);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		cell1.className = "info"
		cell2.className = "deleteIcons"
		dirNum++;
		cell1.innerHTML = info;
		cell2.appendChild(deleteIcon);
		document.getElementById('direction').value = '';
		}
	}
	function deleteDir(table, row){
		var index = row.parentNode.parentNode.rowIndex;
		table.deleteRow(index);
		direction.splice(index, 1);
		dirNum--; 
	}

	const handleChange= () => {
		setCheckedRecipe(!checkedRecipe);
	  };

   return(
        <div id="createDiv" className="displayregion">
        <form>
        <table>
        <td className = "col1">
            <input type="text" id="title" placeholder="My New Recipe" className="titlefield" ref={(c) => title = c} defaultValue={title} /><br />
            <textarea id="description" className="descfield" placeholder="Recipe Description..." ref={(c) => description = c} defaultValue={description}/>
            <div className="lists">
        </div>
		<div className="privateBox">Private: 
			<input
				id="privaterecipe"
				type="checkbox"
				value={checkedRecipe}
				onChange={handleChange}/>
		</div>
        </td>
        <td className = "col2">
        <div className="lists">
        	<div type='text' className = 'label'>Ingredients:</div>
        	<input type="text" id="ingredient" placeholder="Ingredients..." className="ingField"/><br />
        	<input type="button" className="addButton" onClick={addIng} value='+Add Ingredient' />
        	<table>
        	<tbody id="ingredientTable">
        	</tbody>
        	</table>
        </div>
        <div className="lists">
        	<div type='text' className = 'label'>Directions:</div>
        	<textarea id="direction" placeholder="Directions..." className="dirField"/><br />
        	<input type="button" className="addButton" onClick={addDir} value='+Add Direction' />
        	<table className="numbered">
        	<tbody id="directionTable">
        	</tbody>
        	</table>
        </div>
		<div className="lists">
        	<div type='text' className = 'label'>Tags:</div>
        	<input type="text" id="tag" placeholder="Tags..." className="tagField"/><br />
        	<input type="button" className="addButton" onClick={addTag} value='+Add Tag' />
        	<table>
        	<tbody id="tagTable">
        	</tbody>
        	</table>
        </div>
        </td>
        </table>
		
			<div id="bumper" className="buffer"><span id="loginResult" className = "error">{message}</span></div> 
            <input type="submit" id="submitButton" className="submitButton" value ="Save Recipe" onClick={createRecipe} />
        </form>
        </div>
   );
};

export default Edit;