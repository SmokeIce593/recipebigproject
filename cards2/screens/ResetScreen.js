import React, { Component, useState } from 'react';
import { ImageBackground, ActivityIndicator, Button, View, Text, TextInput, Image } from 'react-native';
import { StyleSheet, Pressable, KeyboardAvoidingView } from 'react-native';

global.password1 = '';
global.password2 = '';

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
    const { navigation } = this.props;
    const userInfo = 
    {
      id:navigation.getParam('id', -1),
    }
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
                        <Text style={styles.titlefield}>Reset Password</Text>
                        <Text style={{fontSize:20}}> </Text>
                        <TextInput
                            style={styles.inputfield}
                            placeholder="Password"
                            placeholderTextColor= "#808080"
                            onChangeText={(val) => { this.changePassword1Handler(val) }}
                            />        
                    
                        <Text style={{fontSize:20}}> </Text>

                        <View style={{ flexDirection:'center' }}>
                        <TextInput
                            style={styles.inputfield}
                            placeholder="Confirm Password"
                            placeholderTextColor= "#808080"
                            secureTextEntry={true}
                            onChangeText={(val) => { this.changePassword2Handler(val) }}
                        />
                        </View>
                        <Text style={{fontSize:20, color: '#ff0000', justifyContent: "center"}}>{this.state.message} </Text>
                        </View>
  
                        <Pressable style={styles.loginbuttonfield} onPress={() => this.handleClick(userInfo)}>
                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.buttontext}>Submit</Text>
                        </View>
                        </Pressable>
                        <Text style={{fontSize:10}}> </Text>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
        <Text style={{fontSize:100}}> </Text>
    </ImageBackground>
  );
  }

  handleClick = async (userInfo) =>
  {
    if (global.password1 !== password2)
      {
        this.setState({message: "Passwords do not match."});
      }
      else 
      {
        try
        {
          var obj = {id: userInfo.id, password: global.password1};
          var js = JSON.stringify(obj);

          const response = await fetch('https://recipeprojectlarge.herokuapp.com/api/changepassword',
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

          var res = JSON.parse(await response.text());

          if( res.error !== '' )
          {
            this.setState({message: "Error changing password"});
          }
          else
          {
            this.props.navigation.navigate('Login');
          }
        }
        catch(e)
        {
          this.setState({message: e.message});
        }
      }
    
  }  

  changePassword1Handler = async (val) =>
  {
    global.password1 = val;
  }  
  changePassword2Handler = async (val) =>
  {
    global.password2 = val;
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

