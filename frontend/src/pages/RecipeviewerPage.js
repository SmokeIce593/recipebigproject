import React from 'react';

import Recipeviewer from '../components/Recipeviewer';
import Searchbar from '../components/Searchbar';

const Recipeviewerpage = () =>
{
    return(
      <div className='main-container'>
        <Searchbar />
        <Recipeviewer />
      </div>
    );
};


export default Recipeviewerpage;
