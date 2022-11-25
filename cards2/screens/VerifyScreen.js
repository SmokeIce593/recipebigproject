import React, { Component, useState } from 'react';
import { ImageBackground, ActivityIndicator, Button, View, Text, TextInput, Image } from 'react-native';
import { StyleSheet, Pressable, KeyboardAvoidingView, ScrollView } from 'react-native';

global.verificationCode = '';

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
          <ScrollView 
            showsVerticalScrollIndicator={ false } 
            style={{ flex:1, paddingTop: 300 }} 
            keyboardDismissMode="interactive"
            contentContainerStyle={styles.container}>
            <View style={styles.container}>
                <View style={styles.container}>
                    <Image style={styles.logo} source={require('../assets/logo.png')}/>
                </View>
                <View style={styles.container}>
                    <View style={styles.loginboxfield}>
                        <View style={{alignItems: 'center'}}>
                        <Text style={styles.titlefield}>Email Verification</Text>
                        <Text style={{fontSize:10}}> </Text>
                        <Text style={styles.recovText}>Enter the code sent to your email</Text>
                        <Text style={styles.recovText}>account:</Text>
                        <TextInput
                          style={styles.inputfield}
                          placeholder="Enter code"
                          placeholderTextColor= "#808080"
                          onChangeText={(val) => { this.changeVerificationCodeHandler(val) }}
                        />   
                        <Pressable style={styles.loginbuttonfield} onPress={this.handleClick}>
                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.buttontext}>Submit</Text>
                        </View>
                        </Pressable>  
                        <Text style={{fontSize:10}}> </Text>
                        <Text style={styles.recovText}>Didn't receive a code?</Text>
                        <Pressable onPress={this.handleResendClick}>
                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.forgotText}>Click to resend</Text>
                        </View>
                        </Pressable> 
                        <Text style={{fontSize:10}}> </Text>
                      </View>
                    </View>
                </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <Text style={{fontSize:150}}> </Text>
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
        this.props.navigation.navigate('Login');
      }
    }
    catch(e)
    {
      this.setState({message: e.message});
    }
  }  

  handleResendClick = async () => 
  {

  }

  changeVerificationCodeHandler = async (val) =>
  {
    global.verificationCode = val;
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
    height: 300,
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
  recovText: {
    fontSize: 20,
    marginLeft: '5%',
    marginRight: '5%',
    alignContent: "center",
    justifyContent: "center",
  },
  forgotText:{
    color: '#0000ff',
		justifyContent: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
    border: 'none',
    backgroundColor: 'inherit',
    fontSize: 16,
  }
});

