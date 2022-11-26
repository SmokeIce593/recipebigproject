import React, { Component, useState } from 'react';
import { ImageBackground, ActivityIndicator, Button, View, Text, TextInput, Image } from 'react-native';
import { StyleSheet, Pressable, KeyboardAvoidingView, ScrollView } from 'react-native';

global.localName = '';
global.password = '';
global.userId = -1;
global.firstName = '';
global.lastName = '';
global.search = '';
global.card = '';


export default class LoginScreen extends Component {

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
          <ScrollView 
            showsVerticalScrollIndicator={ false } 
            style={{ flex:1, paddingTop: 150 }} 
            keyboardDismissMode="interactive"
            contentContainerStyle={styles.container}>
            <View style={styles.container}>
                <View style={styles.container}>
                    <Image style={styles.logo} source={require('../assets/logo.png')}/>
                </View>
                <View style={styles.container}>
                    <View style={styles.loginboxfield}>
                        <View style={{alignItems: 'center'}}>
                        <Text style={styles.titlefield}>Log In</Text>
                        <Text style={{fontSize:20}}> </Text>
                        <TextInput
                            style={styles.inputfield}
                            placeholder="Username"
                            placeholderTextColor= "#808080"
                            onChangeText={(val) => { this.changeLoginNameHandler(val) }}
                            />        
                    
                        <Text style={{fontSize:20}}> </Text>

                        <View style={{ flexDirection:'center' }}>
                        <TextInput
                            style={styles.inputfield}
                            placeholder="Password"
                            placeholderTextColor= "#808080"
                            secureTextEntry={true}
                            onChangeText={(val) => { this.changePasswordHandler(val) }}
                        />
                        </View>
                        <Text style={{fontSize:20, color: '#ff0000', justifyContent: "center"}}>{this.state.message} </Text>
                        </View>

                        <Pressable style={styles.loginbuttonfield} onPress={this.handleClick}>
                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.buttontext}>Log In</Text>
                        </View>
                        </Pressable>
                        <Text style={{fontSize:10}}> </Text>
                        <Pressable onPress={this.RecoverClick}>
                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.forgotText}>Forgot Password</Text>
                        </View>
                        </Pressable>
                    </View>
                </View>
            </View>
            
                <Text style={{fontSize:40}}> </Text>
                <Pressable style={styles.loginbuttonfield} onPress={this.handleClick2}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.buttontext}>Register</Text>
                        </View>
                </Pressable>
            
            </ScrollView>
        </KeyboardAvoidingView>
            
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
      else if (res.verified === false)
      {
        this.props.navigation.navigate('Verify');
      }
      else
      {
        this.props.navigation.navigate('Search', { id:res.id, firstName: res.firstName, lastName: res.lastName,
                                                  username: res.username, email: res.email });
      }
    }
    catch(e)
    {
      this.setState({message: e.message});
    }
  } 


  handleClick2 = async () =>
  {
    this.props.navigation.navigate('Register');
  }  

  RecoverClick = async () =>
  {
    this.props.navigation.navigate('Recover');
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
    height: 360,
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
  forgotText:{
    color: '#0000ff',
		justifyContent: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
    border: 'none',
    backgroundColor: 'inherit',
    fontSize: 20,
  }
});

