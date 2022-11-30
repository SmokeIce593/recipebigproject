import React, { Component, useState } from 'react';
import { ImageBackground, ActivityIndicator, Button, View, Text, TextInput, Image } from 'react-native';
import { StyleSheet, Pressable, KeyboardAvoidingView, ScrollView, LogBox, FlatList, ListView } from 'react-native';
import { createRef } from 'react';
import { Picker } from '@react-native-picker/picker';

const questions = [
  "Set recipe to public", 
  "Set recipe to private", 
];

const ingredients = ["test", "123"];

export default class Createscreen extends Component {

  constructor() 
  {
    super()
    this.state = 
    {
      message: ' ',
      myRecipe: {},
      ingredients: [],
      tags: [],
      directions: [],
      ingredientsBullets: [],
      directionsBullets: [],
      tagsBullets: [],
    }
  }
  
  componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }

  UNSAFE_componentWillMount()
  {

    var recipeID= this.props.navigation.getParam('myRecipe', -1);
    this.getSingleRecipe(recipeID);

  }

  getSingleRecipe = async (recipeID) =>
  {
    try
    {
      var obj = {recipeID:recipeID};
      var js = JSON.stringify(obj);

      const response = await fetch('https://recipeprojectlarge.herokuapp.com/api/getsinglerecipe',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());

      if (res.error !== '')
      {
        this.setState({message: "Error getting recipes"});
      }
      else
      {
        var directionsBulletsL = [];
        var ingredientsBulletsL = [];
        var tagsBulletsL = [];
        console.log('success');
        this.setState({recipe: res.recipe.recipe});
        this.setState({description: res.recipe.text_recipe});

        this.setState({directions: [...res.directions]});
        for (var i = 0; i < this.state.directions.length; i++)
        {
          directionsBulletsL.push({key: this.state.directions[i].directions})
        }

        this.setState({ingredients: [...res.ingredients]});
        for (var i = 0; i < this.state.ingredients.length; i++)
        {
          ingredientsBulletsL.push({key: this.state.ingredients[i].ingredient})
        }

        this.setState({tags: [...res.tags]});
        for (var i = 0; i < this.state.tags.length; i++)
        {
          tagsBulletsL.push({key: this.state.tags[i].tagname})
        }

        this.setState({
          directionsBullets: directionsBulletsL,
          ingredientsBullets: ingredientsBulletsL,
          tagsBullets: tagsBulletsL,
        })
      }
    }
    catch(e)
    {
      this.setState({message: e.message});
    }
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
      myRecipe:navigation.getParam('myRecipe', 'default'),
      myRecipe:navigation.getParam('myRecipe', ''),
      recipeName:navigation.getParam('recipeName', ''),
      recipeDesc:navigation.getParam('RecipeDesc', ''),
      recipeIngBullets:navigation.getParam('recipeIngBullets', ''),
      recipeDirBullets:navigation.getParam('recipeDirBullets', ''),
      recipeTagsBullets:navigation.getParam('recipeTagsBullets', ''),
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

                      <View style={styles.recipetab}>
                      <Text style={styles.titlefield}>{this.state.recipe}</Text>
                      <View style={{margin: 5}}>
                        <Text style={styles.headerfield}>Description:</Text>
                        <View style={styles.container2}>
                          <Text style={styles.desctext}>{this.state.description}</Text>
                        </View>
                        <Text></Text> 
                        <View style={styles.container3}>
                          <View style={styles.container2}>
                            <Text style={styles.headerfield}>Ingredients:</Text>
                            <FlatList
                            data={this.state.ingredientsBullets}
                            extraData={this.state.refresh}
                            renderItem={({ item }) => {
                              return (
                                <View style= {{flexDirection:'row'}}>
                                  <Text style={styles.bulletlist}>{`\u2022 ${item.key}`}</Text>
                                </View>
                              )
                            }}
                            style={{margin: 10}}>
                          </FlatList>
                          </View>
                          <View style={styles.container2}>
                          <Text style={styles.headerfield}>Instructions:</Text>
                            <FlatList
                            data={this.state.directionsBullets}
                            extraData={this.state.refresh}
                            renderItem={({ item }) => {
                              return (
                                <View style= {{flexDirection:'row'}}>
                                  <Text style={styles.bulletlist}>{`\u2022 ${item.key}`}</Text>
                                </View>
                              )
                            }}
                            style={{margin: 10}}>
                          </FlatList>
                          </View>
                        </View>
                        <Text></Text> 
                        <View style={styles.container3}>
                          <View style={styles.container2}>
                          <Text style={styles.headerfield}>Privacy:</Text>
                          <Text>Public</Text>
                          </View>
                          <View style={styles.container2}>
                          <Text style={styles.headerfield}>Tags:</Text>
                            <FlatList
                            data={this.state.tagsBullets}
                            extraData={this.state.refresh}
                            renderItem={({ item }) => {
                              return (
                                <View style= {{flexDirection:'row'}}>
                                  <Text style={styles.bulletlist}>{`\u2022 ${item.key}`}</Text>
                                </View>
                              )
                            }}
                            style={{margin: 10}}>
                          </FlatList>
                          </View>
                        </View>
                        <Text></Text> 
                        <View style={styles.container3}>
                          
                          <Pressable style={styles.loginbuttonfield} onPress={() => this.handleClickDelete(userInfo)}>
                            <View style={{alignItems: 'center'}}>
                              <Text style={styles.buttontext}>Delete</Text>
                            </View>
                          </Pressable>
                        </View>
                      </View>
                    </View>



                 
                    
                    </ScrollView>
                  </View>
                </View>
        </KeyboardAvoidingView>
        <Text style={{fontSize:15}}> </Text>
        <Pressable style={styles.loginbuttonfield} onPress={async () => this.refresh(userInfo.myRecipe)}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.buttontext}>Refresh</Text>
          </View>
        </Pressable>
       
        
        
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

  handleClickDelete = async (userInfo) =>
  {

    try
    {
      console.log("THIS:" + userInfo.myRecipe);
      var obj = {id:userInfo.myRecipe};
      var js = JSON.stringify(obj);

      const response = await fetch('https://recipeprojectlarge.herokuapp.com/api/deleterecipe',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());

      if(res.error !== '')
      {
        this.setState({message: res.error});
        console.log(res.error);
      }
      else
      {
        this.setState({
          name: '',
          description: '',
          private: 'false',
          message: '',
          ingredients: [],
          tags: [],
          directions: [],
          ingredientsBullets: [],
          directionsBullets: [],
          tagsBullets: [],
          refresh: !this.state.refresh,
          
        })
        this.props.navigation.navigate('Recipe', userInfo);
      }
    }
    catch(e)
    {
      this.setState({message: e.message});
    }
  }

  refresh = async (recipeID) =>
  {
    this.setState({
      name: '',
      description: '',
      private: 'false',
      message: '',
      ingredients: [],
      tags: [],
      directions: [],
      ingredientsBullets: [],
      directionsBullets: [],
      tagsBullets: [],
      refresh: !this.state.refresh,
      
    })
    await this.getSingleRecipe(recipeID);
    
    this.setState({refresh: !this.state.refresh});
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

      }
    }
    catch(e)
    {
      this.setState({message: e.message});
    }
  }  
  handleEditClick = async (userInfo) =>
  {
    userInfo.recipeName = this.state.recipe;
  
    userInfo.recipeDesc = this.state.description;
    userInfo.recipeIng = this.state.ingredientsBullets;
    userInfo.recipeDir = this.state.ingredientsBullets;
    userInfo.recipeTag = this.state.tagsBullets;


    this.props.navigation.navigate('Edit', userInfo);
  }
  getDataFromState = async (data) =>
  {
    return await data;
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
      backgroundColor: '#EAFCFF',
      position: "center",
      justifyContent: 'center',
      alignContent: 'center',
      borderWidth: 3,
      borderColor: '#000000',
      borderRadius: 21,
      height: '100%',
      width: 340,
      marginRight: "auto",
      marginReft: "auto",
    },
  });
  
  