import React from 'react';

import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
//const bgImage = new URL("/public/bg-mobile.png",import.meta.url)
//style={{display: 'flex', justifyContent:'center', alignItems:'center' , height:'100vh'}}

const LoginPage = () =>
{
    return(
      <div className="main-container" style={{height:'100vh'}} >
        <div class="block" style={{"height":"400px;"}}>
          <div className="centered">
            <div style={{display: 'flex', justifyContent:'center', alignItems:'center' , height:'50vh'}}>
              <PageTitle />
            </div>
            <div class="child">
              <Login />
            </div>  
          </div>
        </div>
      </div>
    );
};


export default LoginPage;
