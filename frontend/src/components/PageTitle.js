import React from 'react';
const logo = new URL("/public/logo.png",import.meta.url);

function PageTitle()
{
   return(
     <img src = {logo} alt="background"/> 
   );
};

export default PageTitle;
