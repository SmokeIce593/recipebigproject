import React from 'react';

import Home from '../components/Home';
import Searchbar from '../components/Searchbar';

const Homepage = () =>
{
    return(
      <div className='main-container'>
        <Searchbar />
        <Home />
      </div>
    );
};


export default Homepage;
