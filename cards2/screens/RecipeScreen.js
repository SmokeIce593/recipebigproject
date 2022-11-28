import React, { Component, useState, useEffect } from 'react';
import { ImageBackground, ActivityIndicator, Button, View, Text, TextInput, Image } from 'react-native';
import { StyleSheet, Pressable, KeyboardAvoidingView, ScrollView, FlatList, ListView } from 'react-native';
import { createRef } from 'react';
import { Picker } from '@react-native-picker/picker';

global.name = '';
global.description = '';
global.ingredient = '';
global.tags = '';
global.instructions = '';

const questions = [
  "Set recipe to public", 
  "Set recipe to private", 
];

global.myRecipes = [];

export default class RecipeScreen extends Component {

  constructor() 
  {
    super()
    this.state = 
    {
      message: ' ',
      myRecipes: [],
      test: 
      [
        {
          id: '124312341234',
          recipe: 'my recipe 1',
          text_recipe: 'my description',
          userid: '123412341234',
          date: '11-11-11',
          privateTable: false,
        },
        {
          id: '124312341234',
          recipe: 'my recipe 2',
          text_recipe: 'my description',
          userid: '123412341234',
          date: '11-11-11',
          privateTable: false,
        },
        {
          id: '124312341234',
          recipe: 'my recipe 3',
          text_recipe: 'my description',
          userid: '123412341234',
          date: '11-11-11',
          privateTable: false,
        },
      ],
    }
  }

  loadRecipes = async (id) =>
  { var recipes = await this.getMyRecipes(id);
    console.log(recipes);
    return recipes;
  }

  UNSAFE_componentDidMount()
  {
    var id = this.props.navigation.getParam('id');

    this.setState({myRecipes: this.loadRecipes});
    global.myRecipes.push(this.loadRecipes(id));

    console.log("Printing state:");
    console.log(this.state.myRecipes);
    console.log("Printing global:");
    console.log(global.myRecipes);
  }

  render(){

    const { navigation } = this.props;
    const userInfo = 
    {
      id:navigation.getParam('id', -1),
      firstName:navigation.getParam('firstName', 'default'),
      lastName:navigation.getParam('lastName', 'default'),
      username:navigation.getParam('username', 'default'),
      email:navigation.getParam('email', 'default'),
      myRecipe:navigation.getParam('myRecipe', ''),

    }
    return(
      <ImageBackground source={require('../assets/backgroundmobilefinal.png')} resizeMode="cover" style={{alignItems: "center", flex: 1, justifyContent: "center"}}> 
        <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}>
            <View style={styles.container}>
              <View style={styles.mainbox}>
                <ScrollView style={styles.scrollView}>
                  <Text></Text> 
                  {/* to make gap at top of scroll view so first box does not collide */}


                  <Text style={styles.error}>{this.state.message}</Text>
                  {this.state.test.map((prop, key) => {
                    return (
                      
                      <View style={styles.recipetab}>
                        <Pressable style={styles.recipebutton} onPress={() => this.handleClickRecipe(prop, userInfo)}>
                          <Text style={styles.titlefield}>{prop.recipe}</Text>
                          <View style={{margin: 5}}>
                            <Text style={styles.headerfield}>Description:</Text>
                            <View style={styles.container2}>
                              <Text style={styles.desctext}>{prop.text_recipe}</Text>
                            </View>
                          </View>
                        </Pressable>
                      </View>
                    
                    )
                  })
                  }

                    <Pressable style={styles.loginbuttonfield} onPress={() => this.loadRecipes(userInfo.id)}>
                      <View style={{alignItems: 'center'}}>
                        <Text style={styles.buttontext}>Refresh</Text>
                      </View>
                  </Pressable>
                </ScrollView>
              </View>
            </View>
        </KeyboardAvoidingView>
        <Text style={{fontSize:15}}> </Text>
        
       
        
        
        <Text style={{fontSize:90}}> </Text>


        <View style={styles.footer}>
        <Pressable style={styles.footerButton} onPress={() => this.handleHomeClick(userInfo)}>
              <View style={{alignItems: 'center'}}>
                <Image style={styles.icon} source={require('../assets/home.png')}/> 
                <Text>Home</Text>    
              </View>
            </Pressable>
            <Pressable style={styles.footerButton} onPress={() => this.handleRecipeClick(userInfo)}>
              <View style={{alignItems: 'center'}}>
                <Image style={styles.icon2} source={require('../assets/reciepe.png')}/> 
                <Text>Recipe</Text>    
              </View>
            </Pressable>
            <Pressable style={styles.footerButton} onPress={() => this.handleCreateClick(userInfo)}>
              <View style={{alignItems: 'center'}}>
                <Image style={styles.icon} source={require('../assets/star.png')}/> 
                <Text>Create</Text>      
              </View>
            </Pressable>
            <Pressable style={styles.footerButton} onPress={() => this.handleSettingsClick(userInfo)}>
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

  getMyRecipes = async (id) =>
  {
    try
    {
      var obj = {id:id};
      var js = JSON.stringify(obj);

      const response = await fetch('https://recipeprojectlarge.herokuapp.com/api/myrecipes',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());

      if (res.error !== '')
      {
        this.setState({message: "Error getting recipes"});
      }

      else if ( res.id <= 0 )
      {
        this.setState({message: "No recipes"});
      }
      else
      {
        this.setState({message: "success"});
        return res.filter;
      }
    }
    catch(e)
    {
      this.setState({message: e.message});
    }
  }

  handleClick = async () =>
  {
    try
    {
      var obj = {id:userInfo.id};
      var js = JSON.stringify(obj);

      const response = await fetch('https://recipeprojectlarge.herokuapp.com/api/search',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());

      if( res.id <= 0 )
      {
        this.setState({message: "No recipes"});
      }
      else
      {
        global.firstName = res.firstName;
        global.lastName = res.lastName;
        global.userId = res.id;
        //this.props.navigation.navigate('Search');
      }
    }
    catch(e)
    {
      this.setState({message: e.message});
    }
  }  
  editRecipeClick = async async =>
  {
    try
    {
      var obj = {id:userInfo.id};
      var js = JSON.stringify(obj);

      const response = await fetch('https://recipeprojectlarge.herokuapp.com/api/search',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());

      if( res.id <= 0 )
      {
        this.setState({message: "No recipes"});
      }
      else
      {
        global.firstName = res.firstName;
        global.lastName = res.lastName;
        global.userId = res.id;
        //this.props.navigation.navigate('Search');
      }
    }
    catch(e)
    {
      this.setState({message: e.message});
    }
  }  
  deleteRecipeClick = async async =>
  {
    try
    {
      var obj = {};
      var js = JSON.stringify(obj);

      const response = await fetch('https://recipeprojectlarge.herokuapp.com/api/delete',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());

      if( res.id <= 0 )
      {
        this.setState({message: "No recipes"});
      }
      else
      {
        global.firstName = res.firstName;
        global.lastName = res.lastName;
        global.userId = res.id;
        //this.props.navigation.navigate('Search');
      }
    }
    catch(e)
    {
      this.setState({message: e.message});
    }
  }  

  handleClickRecipe = async (prop, userInfo) =>
  {
    userInfo.myRecipe = prop.id;
    console.log("Prop" + prop.recipe);
    this.props.navigation.navigate('Search', userInfo);
  }

  handleHomeClick = async (userInfo) =>
  {
    this.props.navigation.navigate('Search', userInfo);
  }
  handleRecipeClick = async (userInfo) =>
  {
    this.props.navigation.navigate('Recipe', userInfo);
  }  
  handleCreateClick = async (userInfo) =>
  {
    this.props.navigation.navigate('Create', userInfo);
  }  
  handleSettingsClick = async (userInfo) =>
  {
    this.props.navigation.navigate('Setting', userInfo);
  }  
  handleLogoutClick = async () =>
  {
    this.props.navigation.navigate('Login');
  }      
  changeNameHandler = async (val) =>
  {
    global.name = val;
  }  

  changeDescHandler = async (val) =>
  {
    global.description = val;
  }  



  

}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    flex: 1,
    width: '100%'
  },
  container3: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  mainbox: {
    alignItems: "center",
    position: "center",
    backgroundColor: '#EAFCFF',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 21,
    height: 600,
    width: 360,
    justifyContent: "center",
    marginRight: "auto",
    marginReft: "auto",
  },
  titlefield: {
    alignContent: 'center',
    justifyContent: 'center',
    fontSize: 30,
    textAlign: "center",
  },
  headerfield: {
    textDecorationLine: 'underline',
    fontSize: 25,
    justifyContent: 'center',
    alignContent: 'center',
  },
  desctext: {
    fontSize: 18,
    justifyContent: 'center',
    alignContent: 'center',
  },
  inputfield1: {
    height: 50,
	  width: 280,
	  backgroundColor: '#F7F7F7',
    textAlign: 'center',
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
  inputfield2: {
    height: 100,
	  width: 280,
	  backgroundColor: '#F7F7F7',
	  borderRadius: 10,
    borderWidth: 1, //this is the border for input fields since react native shadow is weird
	  marginTop: 4,
	  marginBottom: 4,
	  fontSize: 18,
	  marginRight: "auto",
	  marginLeft: "auto",
  },
  inputfield3: {
    height: 30,
	  width: 280,
	  backgroundColor: '#F7F7F7',
	  borderRadius: 10,
    borderWidth: 1, //this is the border for input fields since react native shadow is weird
	  marginTop: 4,
	  marginBottom: 4,
	  fontSize: 18,
	  marginRight: "auto",
	  marginLeft: "auto",
  },
  loginbuttonfield: {
    height: 50,
	  width: 150,
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
  addbuttonfield: {
    height: 30,
	  width: 280,
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
  picker: {
    height: 50,
    width: 280,
    marginLeft: "auto",
	  marginRight: "auto",
    marginTop: 1,
    marginBottom: 20,
    justifyContent: "center",
    alignContent: "center",
  },
  question: {
    fontSize: 17,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
    zblock: {
    width: 350,
    backgroundColor: '#EAFCFF',
    borderRadius: 21,
    paddingTop: 8,
    paddingBottom: 5,
    zIndex: 1,
    elevation: 1,
    borderRadius: 21,
  },
  recipetab: {
    backgroundColor: '#ffffff', 
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 21,
    width: 340,
    marginRight: "auto",
    marginReft: "auto",
    marginBottom: 10,
  },
  recipebutton: {
    zIndex: 10,
    paddingBottom: 20,
  },
});

