import React, { Component, useState } from 'react';
import { ImageBackground, ScrollView, ActivityIndicator, Button, LogBox, View, Text, TextInput, Image, FlatList } from 'react-native';
import { StyleSheet, Pressable } from 'react-native';
// import { List, ListItem } from "react-native-elements";

global.search = '';

export default class SearchScreen extends Component {

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

  componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
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
        
          <View style={styles.header}>
            <TextInput
              style={styles.inputfield}
              placeholder="Search"
              placeholderTextColor= "#808080"
              onChangeText={(val) => { this.changeSearchHandler(val) }}
            />    
            <Pressable style={styles.buttonfield} onPress={() => this.handleSearchClick(userInfo)}>
              <View style={{alignItems: 'center'}}>
                <Image style={styles.icon} source={require('../assets/searchicon.png')}/>     
              </View>
            </Pressable>
          </View>

          <View style={styles.container}>
              <View style={styles.mainbox}>
                <ScrollView style={styles.scrollView}>
                <Text style={{fontSize:6}}> </Text>
                  {/* to make gap at top of scroll view so first box does not collide */}


                  {/* <Text style={styles.error}>{this.state.message}</Text> */}
                  {this.state.test.map((prop, key) => {
                    return (
                      <View style={styles.container3}>
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











          
          <View style={styles.footer}>
          <Pressable style={styles.footerButton} onPress={() => this.handleHomeClick(userInfo)}>
              <View style={{alignItems: 'center'}}>
                <Image style={styles.icon} source={require('../assets/home.png')}/> 
                <Text>Home</Text>    
              </View>
            </Pressable>
            <Pressable style={styles.footerButton} onPress={() => this.handleRecipeClick(userInfo)}>
              <View style={{alignItems: 'center'}}>
                <Image style={styles.icon} source={require('../assets/reciepe.png')}/> 
                <Text>Recipe</Text>    
              </View>
            </Pressable>
            <Pressable style={styles.footerButton} onPress={() => this.handleCreateClick(userInfo)}>
              <View style={{alignItems: 'center'}}>
                <Image style={styles.icon} source={require('../assets/star.png')}/> 
                <Text>Create</Text>      
              </View>
            </Pressable>
            <Pressable 
              style={styles.footerButton} 
              onPress={() => this.handleSettingsClick(userInfo) }>
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
    var obj = {userId:global.userId.trim(),search:global.search.trim()};
    var js = JSON.stringify(obj);
    try
    {
      const response = await fetch('https://recipeprojectlarge.herokuapp.com/api/search',
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
    marginTop: 50,
    top: 1,
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
	  // borderRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    // borderWidth: 1, //this is the border for input fields since react native shadow is weird
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
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
    // borderRadius: 10,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    fontSize: 36,
    marginTop: 4,
    marginBottom: 4,
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
  mainbox: {
    alignItems: "center",
    position: "center",
    backgroundColor: '#EAFCFF',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 21,
    height: 500,
    width: 360,
    justifyContent: "center",
    marginRight: "auto",
    marginReft: "auto",
  },
  container3: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto'
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
  loginbuttonfield: {
    height: 20,
	  width: 300,
    backgroundColor: '#FF7A70',
    borderRadius: 10,
    fontSize: 36,
    marginTop: 4,
    marginBottom: 2,
    justifyContent: "center",
    alignContent: "center",
    zIndex: 1,
    elevation: 1,
  },
});
