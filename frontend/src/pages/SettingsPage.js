import React from 'react';

import Settings from '../components/Settings';
import Searchbar from '../components/Searchbar';

const Settingspage = () =>
{
    return(
      <div className='main-container'>
        <Searchbar />
        <Settings />
      </div>
    );
};


export default Settingspage;
