import React from 'react';

import Recipes from '../components/Recipes';
import Searchbar from '../components/Searchbar';

const Recipespage = () =>
{
    return(
      <div className='main-container'>
        <Searchbar />
        <Recipes />
      </div>
    );
};


export default Recipespage;
