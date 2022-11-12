import React from 'react';

import PageTitle from '../components/PageTitle';
import Home from '../components/Home';

const Homepage = () =>
{
    return(
      <div className='main-container'>
        <PageTitle />
        <Home />
      </div>
    );
};


export default Homepage;
