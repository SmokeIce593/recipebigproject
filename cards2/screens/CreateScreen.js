import React, { Component, useState } from 'react';
import { ImageBackground, ActivityIndicator, Button, View, Text, TextInput, Image } from 'react-native';
import { StyleSheet, Pressable, KeyboardAvoidingView, ScrollView, FlatList, ListView } from 'react-native';
import { createRef } from 'react';
import { Picker } from '@react-native-picker/picker';

global.ingredients = [];
global.tags = [];
global.directions = [];

const privacyoptions = [
  "Make recipe public", 
  "Make recipe private", 
];

global.ingredientsBullets = [];
global.directionsBullets = [];
global.tagsBullets = [];

export default class Createscreen extends Component {

  constructor() 
  {
    super()
    this.state = 
    {
      message: ' '
    }
  }

  renderRow(data) {
    return (
      <Text>{`\u2022 ${data}`}</Text>
    );
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
    }
    return(
      <ImageBackground source={require('../assets/backgroundmobilefinal.png')} resizeMode="cover" style={{alignItems: "center", flex: 1, justifyContent: "center"}}> 
        <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}>
            <View style={styles.container}>
                <View style={styles.container}>
                  <View style={styles.loginboxfield}>
                    <ScrollView style={styles.scrollView}>
                      <View style={{alignItems: 'center'}}>
                        <Text style={{fontSize:5}}> </Text>
                          <Text style={styles.titlefield}>Create Recipe</Text>
                          <Text style={{fontSize:20}}> </Text>
                          <TextInput
                            style={styles.inputfield1}
                            placeholder="Recipe Name"
                            placeholderTextColor= "#808080"
                            value={this.state.name}
                            onChangeText={(val) => { this.changeNameHandler(val) }}
                            />        
                          <Text style={styles.headerfield}>Description:</Text>
                          <ScrollView style={styles.scrollView}>
                            <TextInput
                              style={styles.inputfield2}
                              placeholder="Description"
                              placeholderTextColor= "#808080"
                              value = {this.state.description}
                              multiline={true} 
                              onChangeText={(val) => { this.changeDescHandler(val) }}
                            />        
                          </ScrollView>

                          <Text style={styles.headerfield}>Ingredients:</Text>
                          <FlatList
                            data={global.ingredientsBullets}
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
                            <TextInput
                              style={styles.inputfield3}
                              placeholder="Ingredient"
                              placeholderTextColor= "#808080"
                              value={this.state.ingredient}
                              onChangeText={(val) => { this.changeIngredientHandler(val) }}
                            />      
                            <Pressable style={styles.addbuttonfield} onPress={this.addIngredientClick}>
                              <View style={{alignItems: 'center'}}>
                                <Text style={styles.smallbuttontext}>+ Add Ingredient</Text>
                              </View>
                            </Pressable>  
                          <Text style={styles.headerfield}>Directions:</Text>
                          <FlatList
                            data={global.directionsBullets}
                            extraData={this.state.refresh}
                            renderItem={({ item }) => {
                              return (
                                <View>
                                  <Text style={styles.bulletlist}>{`\u2022 ${item.key}`}</Text>
                                </View>
                              )
                            }}
                            style={{margin: 10}}>
                          </FlatList>
                            <TextInput
                                style={styles.inputfield3}
                                placeholder="Next step:"
                                placeholderTextColor= "#808080"
                                value={this.state.direction}
                                onChangeText={(val) => { this.changeDirectionHandler(val) }}
                              />      
                              <Pressable style={styles.addbuttonfield} onPress={this.addDirectionClick}>
                                <View style={{alignItems: 'center'}}>
                                  <Text style={styles.smallbuttontext}>+ Add Step</Text>
                                </View>
                              </Pressable>  
                          <Text style={styles.headerfield}>Tags:</Text>
                          <FlatList
                            data={global.tagsBullets}
                            extraData={this.state.refresh}
                            renderItem={({ item }) => {
                              return (
                                <View>
                                  <Text style={styles.bulletlist}>{`\u2022 ${item.key}`}</Text>
                                </View>
                              )
                            }}
                            style={{margin: 10}}>
                          </FlatList>
                            <TextInput
                                style={styles.inputfield3}
                                placeholder="ex. Vegetarian"
                                placeholderTextColor= "#808080"
                                value={this.state.tag}
                                onChangeText={(val) => { this.changeTagHandler(val) }}
                              />      
                              <Pressable style={styles.addbuttonfield} onPress={this.addTagClick}>
                                <View style={{alignItems: 'center'}}>
                                  <Text style={styles.smallbuttontext}>+ Add Tag</Text>
                                </View>
                              </Pressable>  
                          <View style= { styles.zblock }>
                            <Text style={styles.headerfield}>Visibility:</Text>
                          </View>
                          
                            <View style ={ {zIndex: 0, elevation: 0} }>
                              <Picker
                                style={ styles.picker }
                                itemStyle={ styles.question }
                                selectedValue={ this.state.selectedQuestion }
                                onValueChange=
                                {
                                  (itemValue, itemIndex) =>
                                  {        
                                    this.setState({ selectedQuestion: itemValue })
                                    this.state.private = itemValue;
                                  }
                                }>
                                <Picker.Item label="Make recipe public" value={ false } />
                                <Picker.Item label="Make recipe private" value={ true } />
                              </Picker>
                            </View>

                            <Text style={ styles.error }>
                              { this.state.message }
                            </Text>
                      </View>
                      {/* insert here for button inside box */}
                    </ScrollView>
                  </View>
                </View>
            </View>
        </KeyboardAvoidingView>
        <Text style={{fontSize:15}}> </Text>
        <Pressable style={styles.loginbuttonfield} onPress={() => this.createRecipe(userInfo)}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.buttontext}>Create Recipe</Text>
          </View>
        </Pressable>
        {/* <Pressable style={styles.loginbuttonfield} onPress={this.handleClick}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.buttontext}>Save Recipe</Text>
          </View>
        </Pressable> */}
        
        
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

  createRecipe = async (userInfo) =>
  {
    try
    {
      var obj = {recipename:this.state.name, recipetext:this.state.description,
                fkuser:userInfo.id, privaterecipe:this.state.private,
                tags:global.tags, ingredients: global.ingredients,
                directions: global.directions};

      var js = JSON.stringify(obj);

      const response = await fetch('https://recipeprojectlarge.herokuapp.com/api/saverecipe',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());

      if( res.error !== '' )
      {
        this.setState({message: "Error creating recipe"});
      }
      else
      {
        global.tags = [];
        global.ingredients = [];
        global.directions = [];
        global.ingredientsBullets = [];
        global.directionsBullets = [];
        global.tagsBullets = [];
        this.setState({
          name: '',
          description: '',
          private: 'false',
          refresh: !this.state.refresh
        })
        this.props.navigation.navigate('Recipe', userInfo);
      }
    }
    catch(e)
    {
      this.setState({message: e.message});
    }
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
    this.state.name = val;
  }  
  changeDescHandler = async (val) =>
  {
    this.state.description = val;
  }  

  addIngredientClick = async () =>
  {
    global.ingredientsBullets.push({key: this.state.ingredient});
    global.ingredients.push(this.state.ingredient);
    this.state.ingredient = '';
    this.setState({
      refresh: !this.state.refresh
    })
  } 
  addDirectionClick = async () =>
  {
    global.directionsBullets.push({key: this.state.direction});
    global.directions.push(this.state.direction);
    this.state.direction = '';
    this.setState({
      refresh: !this.state.refresh
    })
  }
  addTagClick = async () =>
  {
    global.tagsBullets.push({key: this.state.tag});
    global.tags.push(this.state.tag);
    this.state.tag = '';
    this.setState({
      refresh: !this.state.refresh
    })
  }
  changeIngredientHandler = async (val) =>
  {
    this.state.ingredient = val;
  }  
  changeDirectionHandler = async (val) =>
  {
    this.state.direction = val;
  }
  changeTagHandler = async (val) =>
  {
    this.state.tag = val;
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
    height: 600,
    width: 360,
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
  headerfield: {
    textDecorationLine: 'underline',
    display: "flex",
    flexDirection: "column",
    fontSize: 30,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: "center",
    zIndex: 1,
    elevation: 1,
    backgroundColor: '#EAFCFF',
    marginTop: 15,
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
    paddingLeft: 10,
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
    paddingLeft: 10,
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
  smallbuttontext: {
    fontSize: 18,
    alignContent: "center",
    justifyContent: "center",
    margin: "auto"
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
    marginBottom: 70,
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
  bulletlist: {
    fontSize: 20,
  },
  deletebullet: {
    alignContent: "center",
    justifyContent: "center",
    margin: "auto"
  },
});

