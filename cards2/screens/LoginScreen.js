import React, { Component, useState } from 'react';
import { ActivityIndicator, Button, View, Text, TextInput } from 'react-native';
global.localName = '';
global.password = '';
global.userId = -1;
global.firstName = '';
global.lastName = '';
global.search = '';
global.card = '';
export default class Homescreen extends Component {
  constructor() 
  {
    super()
    this.state = 
    {
       message: ' '
    }
  }
  render(){
    return(
      <View style={{ backgroundColor:'#0000ff', flex: 1, alignItems: 'center', justifyContent: 
'center' }}>
      <View style={{alignItems: 'flex-end'}}>
      <View style={{ flexDirection:'row' }}>
        <Text style={{fontSize:20}}>Login Screen: </Text>
        <TextInput
          style={{height: 30,fontSize:20, backgroundColor:'#ffffff'}}
          placeholder="Login Name"
          onChangeText={(val) => { this.changeLoginNameHandler(val) }}
        />        
      </View>
      <Text style={{fontSize:20}}> </Text>
      <View style={{ flexDirection:'row' }}>
        <Text style={{fontSize:20}}>Password: </Text>
        <TextInput
          style={{height: 30,fontSize:20, backgroundColor:'#ffffff'}}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(val) => { this.changePasswordHandler(val) }}
        />
      </View>
      <Text style={{fontSize:20}}>{this.state.message} </Text>
      </View>
      <Button
        title="Do Login"
        onPress={this.handleClick}
      />
    </View>
    );
  }
  handleClick = async () =>
  {
    try
    {
      var obj = {login:global.loginName.trim(),password:global.password.trim()};
      var js = JSON.stringify(obj);
      const response = await fetch('https://cop4331-10.herokuapp.com/api/login',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
      var res = JSON.parse(await response.text());
      if( res.id <= 0 )
      {
        this.setState({message: "Usere/Password combination incorrect" });
      }
      else
      {
        global.firstName = res.firstName;
        global.lastName = res.lastName;
        global.userId = res.id;
        this.props.navigation.navigate('Card');
      }
    }
    catch(e)
    {
      this.setState({message: e.message });
    }
  }  
  changeLoginNameHandler = async (val) =>
  {
    global.loginName = val;
  }  
  changePasswordHandler = async (val) =>
  {
    global.password = val;
  }  
}