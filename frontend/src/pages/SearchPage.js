import React from 'react';

import Search from '../components/Search';
import Searchbar from '../components/Searchbar';

const SearchPage = () =>
{
    return(
      <div className='main-container'>
        <Searchbar />
        <Search />
      </div>
    );
};

export default SearchPage;
