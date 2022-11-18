import React, { useState } from 'react';
import './create.css'

var title;
var description;
var ingredient;
var direction;
var tag;

function Create()
{
	const createRecipe = async event =>
	{
	}

	var ingNum = 0;
	const addIng = async event => {
	if(document.getElementById('ingredient').value != ""){
		var table = document.getElementById('ingredientTable');
		var info = document.getElementById('ingredient').value;
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
	
	function deleteIng(table, row){
		var index = row.parentNode.parentNode.rowIndex;
		table.deleteRow(index);
		ingNum--;
	}
	
	var dirNum = 0;
	const addDir = async event => {
	if(document.getElementById('direction').value != ""){
		var table = document.getElementById('directionTable');
		var info = document.getElementById('direction').value;
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
		dirNum--; 
	}
	    
   return(
        <div id="createDiv" className="displayregion">
        <form>
        <table>
        <td className = "col1">
            <input type="text" id="title" placeholder="My New Recipe" className="titlefield" ref={(c) => title = c} /><br />
            <textarea id="description" className="descfield" placeholder="Recipe Description..."/>
            <div className="lists">
        	<div type="text" className = 'label'>Tags:</div>
        	<div id="tagList">
            </div>
        	<textarea id="tags" className = "tagField" placeholder="Enter tags separated by a space..."/>
        </div>
            <div className = "privateBox">Private: <input type="checkbox" id="privateCheck" /></div>
        </td>
        <td className = "col2">
        <div className="imgUpload">
        	<img id="userUpload"/>
        	<label for="userUpload">Upload an image of your recipe: </label>
 		<input type="file" id="userUpload" accept="image/*" onchange="showPreview(event);"/>
        </div>
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
        </td>
        </table>
            <input type="submit" id="submitButton" className="submitButton" value ="Save Recipe" onClick={createRecipe} />
        </form>
        </div>
   );
};

export default Create;