import React from 'react'
import "Nutrition.css"

const Nutrition = ({ title, ingredients }) => {
    return(
        <div className='recipe'>
            <h1>{title}</h1>
            <ol>
                {ingredients.map(ingredient => (
                    <li>{ingredient.text}</li>
                ))}
            </ol>
        </div>
    )
}

export default Nutrition