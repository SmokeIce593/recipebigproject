import React from 'react';

import Create from '../components/Create';
import Searchbar from '../components/Searchbar';

const Createpage = () =>
{
    return(
      <div className='main-container'>
        <Searchbar />
        <Create />
      </div>
    );
};


export default Createpage;
