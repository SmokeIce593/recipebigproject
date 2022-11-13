import React from 'react';
import './Pagetitle.css';

const logo = new URL("/public/logo.png",import.meta.url);

function PageTitle()
{
   return(
     <img src = {logo} alt="background" className="logo"/> 
   );
};

export default PageTitle;
