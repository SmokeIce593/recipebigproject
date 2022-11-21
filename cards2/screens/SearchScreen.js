import React, { Component, useState } from 'react';
import { ImageBackground, ActivityIndicator, Button, View, Text, TextInput, Image } from 'react-native';
import { StyleSheet, Pressable } from 'react-native';

global.search = '';

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
        
          <View style={styles.header}>
            <TextInput
              style={styles.inputfield}
              placeholder="Search"
              placeholderTextColor= "#808080"
              onChangeText={(val) => { this.changeSearchHandler(val) }}
            />    
            <Pressable style={styles.buttonfield} onPress={this.handleSearchClick}>
              <View style={{alignItems: 'center'}}>
                <Image style={styles.icon} source={require('../assets/searchicon.png')}/>     
              </View>
            </Pressable>
          </View>
          
          <View style={styles.footer}>
          <Pressable style={styles.footerButton} onPress={this.handleHomeClick}>
              <View style={{alignItems: 'center'}}>
                <Image style={styles.icon} source={require('../assets/home.png')}/> 
                <Text>Home</Text>    
              </View>
            </Pressable>
            <Pressable style={styles.footerButton} onPress={this.handleRecipeClick}>
              <View style={{alignItems: 'center'}}>
                <Image style={styles.icon} source={require('../assets/reciepe.png')}/> 
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

  handleSearchClick = async () => 
  {
    var obj = {userId:global.userId,search:global.search};
    var js = JSON.stringify(obj);
    try
    {
      const response = await fetch('https://cop4331-10.herokuapp.com/api/searchcards',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
      var res = JSON.parse(await response.text());
      var _results = res.results;
      var resultText = '';
      for( var i=0; i<_results.length; i++ )
      {
          resultText += _results[i];
          if( i < _results.length - 1 )
          {
              resultText += '\n';
          }
      }
      resultText += '\n';
      this.setState({searchCriteria: resultText });
    }
    catch(e)
    {
      this.setState({searchCriteria: e.message });
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
  
  

  changeSearchHandler = async (val) =>
  {
    global.search = val;
  }  
  changeCardHandler = async (val) =>
  {
    global.card = val;
  } 
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    marginTop: 100,
    top: 0,
    alignItems: 'center',
    justifyContent:'center',
    flexDirection: 'row',
  },
  searchBox: {
    fontSize: 36,
    width: 200,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    justifyContent: 'center',
    alignContent: 'center',
  },
  searchBar :{
    display: 'flex',
    position: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 50,
    borderRadius: 40,
    width: 637,
    height: 64,
    background: '#EDF2EF',
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
  buttonfield: {
    height: 50,
	  width: 50,
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
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    position: 'center',
    margin: 'auto',
  },
  icon2: {
    display: 'flex',
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignContent: 'center',
    position: 'center',
    margin: 'auto',
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