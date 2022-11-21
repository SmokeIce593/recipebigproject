import React, { Component, useState } from 'react';
import { ImageBackground, ActivityIndicator, Button, View, Text, TextInput, Image } from 'react-native';
import { StyleSheet, Pressable, KeyboardAvoidingView } from 'react-native';

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
      <ImageBackground source={require('../assets/backgroundmobilefinal.png')} resizeMode="cover" style={{alignItems: "center", flex: 1, justifyContent: "center"}}> 
        <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}>
            <View style={styles.container}>
                <View style={styles.container}>
                    <Image style={styles.logo} source={require('../assets/logo.png')}/>
                </View>
                <View style={styles.container}>
                    <View style={styles.loginboxfield}>
                        <View style={{alignItems: 'center'}}>
                        <Text style={styles.titlefield}>Recipe Screen</Text>
                        <Text style={{fontSize:20}}> </Text>
                        
                        
                        <Text style={{fontSize:20, color: '#ff0000', justifyContent: "center"}}>{this.state.message} </Text>
                        </View>

                       
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
        <View style={styles.footer}>
        <Pressable style={styles.footerButton} onPress={this.handleHomeClick}>
              <View style={{alignItems: 'center'}}>
                <Image style={styles.icon} source={require('../assets/home.png')}/> 
                <Text>Home</Text>    
              </View>
            </Pressable>
            <Pressable style={styles.footerButton} onPress={this.handleRecipeClick}>
              <View style={{alignItems: 'center'}}>
                <Image style={styles.icon2} source={require('../assets/reciepe.png')}/> 
                <Text>Recipe</Text>    
              </View>
            </Pressable>
            <Pressable style={styles.footerButton} onPress={this.handleCreateClick}>
              <View style={{alignItems: 'center'}}>
                <Image style={styles.icon} source={require('../assets/star.png')}/> 
                <Text>Create</Text>      
              </View>
            </Pressable>
            <Pressable style={styles.footerButton} onPress={this.handleSettingsClick}>
              <View style={{alignItems: 'center'}}>
                <Image style={styles.icon} source={require('../assets/cog.png')}/>   
                <Text>Settings</Text>    
              </View>
            </Pressable>
            <Pressable style={styles.footerButton} onPress={this.handleLogoutClick}>
              <View style={{alignItems: 'center'}}>
                <Image style={styles.icon} source={require('../assets/logout.png')}/> 
                <Text>Logout</Text>      
              </View>
            </Pressable>
          </View>
    </ImageBackground>
  );
  }

  handleClick = async () =>
  {
    try
    {
      var obj = {login:global.loginName.trim(),password:global.password.trim()};
      var js = JSON.stringify(obj);

      const response = await fetch('https://recipeprojectlarge.herokuapp.com/api/login',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());

      if( res.id <= 0 )
      {
        this.setState({message: "User/Password combination incorrect"});
      }
      else
      {
        global.firstName = res.firstName;
        global.lastName = res.lastName;
        global.userId = res.id;
        this.props.navigation.navigate('Search');
      }
    }
    catch(e)
    {
      this.setState({message: e.message});
    }
  }  

  handleHomeClick = async () =>
  {
    this.props.navigation.navigate('Search');
  }
  handleRecipeClick = async () =>
  {
    this.props.navigation.navigate('Recipe');
  }  
  handleCreateClick = async () =>
  {
    this.props.navigation.navigate('Create');
  }  
  handleSettingsClick = async () =>
  {
    this.props.navigation.navigate('Setting');
  }  
  handleLogoutClick = async () =>
  {
    this.props.navigation.navigate('Login');
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

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginboxfield: {
    alignItems: "center",
    position: "center",
    backgroundColor: '#EAFCFF',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 21,
    height: 330,
    width: 370,
    justifyContent: "center",
    marginRight: "auto",
    marginReft: "auto",
  },
  logo: {
    width: 400,
    height: 100,
    justifyContent: "center",
  },
  titlefield: {
    display: "flex",
    flexDirection: "column",
    fontSize: 36,
    minWidth: 122,
    textAlign: "center",
    marginTop: 4,
  },
  inputfield: {
    height: 50,
	  width: 300,
	  backgroundColor: '#F7F7F7',
	  borderRadius: 10,
    borderWidth: 1, //this is the border for input fields since react native shadow is weird
	  marginTop: 4,
	  marginBottom: 4,
	  display: "flex",
    	flexDirection: "column",
	  justifyContent: "center",
	  fontSize: 36,
	  marginRight: "auto",
	  marginLeft: "auto",
  },
  loginbuttonfield: {
    height: 50,
	  width: 300,
    marginLeft: "auto",
	  marginRight: "auto",
    backgroundColor: '#FF7A70',
    borderRadius: 10,
    fontSize: 36,
    marginTop: 4,
    marginBottom: 2,
    justifyContent: "center",
    alignContent: "center",
    marginRight: "auto",
    marginLeft: "auto",
  },
  buttontext: {
    fontSize: 36,
    alignContent: "center",
    justifyContent: "center",
    margin: "auto"
  },
  footer: {
    position: 'absolute', 
    bottom: 0, 
    height: 100, 
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#93B7BE', 
    alignContent: 'center', 
    justifyContent: 'center',
    flexDirection: 'row'
  },
  footerButton: {
    height: 70,
    width: 70,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 10,
    fontSize: 36,
    marginTop: 4,
    marginBottom: 2,
    justifyContent: "center",
    alignContent: "center",
    marginRight: "auto",
    marginLeft: "auto",
  },
});

