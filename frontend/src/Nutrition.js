import React from 'react';
import e from 'express';


const titleInput = document.getElementById('title');
const recipeInput = document.getElementById('recipe');
const output = document.getElementById('output');
const appID = '3c83e59a';
const appKey ='7562b5bc9d61a7d8ae68edd47888c04a';

function fetchRecipe() {
    let title = titleInput.value;
    let ingr = recipeInput.value.split('\n');

    return fetch(`https://api.edamam.com/api/nutrition-details?app_id=${appID}&app_key=${appKey}`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title, ingr})
    }).then(response => response.json());
}

document.getElementById('recipe-check-form').addEventListener('submit', function(e) {
    e.preventDefault();

    fetchRecipe().then(data => {
        console.log(data);
    });
})
