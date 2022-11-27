import React from 'react';

import Edit from '../components/Edit';
import Searchbar from '../components/Searchbar';

const Createpage = () =>
{
    return(
      <div className='main-container'>
        <Searchbar />
        <Edit />
      </div>
    );
};


export default Createpage;
