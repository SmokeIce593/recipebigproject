import React, { Component, useState } from 'react';
import { ImageBackground, ActivityIndicator, Button, View, Text, TextInput, Image } from 'react-native';
import { StyleSheet, Pressable } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

global.localName = '';
global.loginName = '';
global.password = '';
global.userId = -1;
global.firstName = '';
global.lastName = '';
global.question = '';
global.answer = '';
global.search = '';
global.card = '';
global.email = '';


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
      <ImageBackground source={require('../assets/backgroundimage.jpg')} resizeMode="cover" style={{alignItems: "center", flex: 1, justifyContent: "center"}}> 
        <View style={styles.container}>
          <View style={styles.container}>
            <Image style={styles.logo} source={require('../assets/logo.png')}/>
          </View>
          <View style={styles.container}>
          <View style={styles.loginboxfield}>
            <View style={{alignItems: 'center'}}>
            <Text style={{fontSize:10}}> </Text>
            <Text style={styles.titlefield}>Create an account</Text>
            <Text style={{fontSize:20}}> </Text>

            <TextInput
                style={styles.inputfield}
                placeholder="First name"
                placeholderTextColor= "#808080"
                onChangeText={(val) => { this.changeFirstNameHandler(val) }}
                />        
           
            <Text style={{fontSize:20}}> </Text>

            <TextInput
                style={styles.inputfield}
                placeholder="Last name"
                placeholderTextColor= "#808080"
                onChangeText={(val) => { this.changeLastNameHandler(val) }}
                />   

            <Text style={{fontSize:20}}> </Text>

            <TextInput
                style={styles.inputfield}
                placeholder="Email"
                placeholderTextColor= "#808080"
                onChangeText={(val) => { this.changeEmailHandler(val) }}
                />        
           
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


            <SelectDropdown
              buttonStyle = {styles.dropdown}
              buttonTextStyle = {styles.dropdowntext}
              rowStyle = {styles.dropdownrow}
              rowTextStyle = {styles.dropdownrowtext}
              defaultButtonText="Select Security Question:"
              dropdownIconPosition="right"
              data={questions}
              onSelect={(val) => { this.changeQuestionHandler(val) }}
              buttonTextAfterSelection={(selectedItem, index) => {return selectedItem}}
              rowTextForSelection={(item, index) => {return item}}
            />


            <Text style={{fontSize:20}}> </Text>

            <View style={{ flexDirection:'center' }}>
              <TextInput
                style={styles.inputfield}
                placeholder="Answer"
                placeholderTextColor= "#808080"
                secureTextEntry={true}
                onChangeText={(val) => { this.changeAnswerHandler(val) }}
              />
            </View>
            
            <Text style={{fontSize:20, color: '#ff0000', justifyContent: "center"}}>{this.state.message} </Text>
            </View>

            <Pressable style={styles.loginbuttonfield} onPress={this.handleClickRegister}>
              <Text style={styles.buttontext}>Register</Text>
            </Pressable>

          </View>
          <Text style={{fontSize:40}}> </Text>
          
            <Pressable style={styles.loginbuttonfield} onPress={this.handleClickLogin}>
              <Text style={styles.buttontext}>Log In</Text>
            </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
  }

  handleClickLogin = async () =>
  {
    this.props.navigation.navigate('Login');
  }  

  handleClickRegister = async () =>
  {

    try
    {
      var obj = {login:global.loginName.trim(), password:global.password.trim(), email:global.email.trim(),
                 firstname:global.firstName.trim(), lastname:global.lastName.trim(),
                 securityquestion:global.question, securityanswer:global.answer.trim()};
      var js = JSON.stringify(obj);

      const response = await fetch('https://recipeprojectlarge.herokuapp.com/api/register',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());

      if( res.error !== "" )
      {
        console.log(res.error)
        this.setState({message: "Register failed. Fuck you"});
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
      this.setState({message: e.message});
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

  changeFirstNameHandler = async (val) =>
  {
    global.firstName = val;
  } 

  changeLastNameHandler = async (val) =>
  {
    global.lastName = val;
  } 

  changeEmailHandler = async (val) =>
  {
    global.email = val;
  } 

  changeAnswerHandler = async (val) =>
  {
    global.answer = val;
  } 

  changeQuestionHandler = async (val) =>
  {
    global.question = questions.indexOf(val);
  } 

}

const questions = ["What is your father's middle name?", "What was the name of your high school?", 
                   "What is the name of your first pet?"];

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
    width: 418,
    justifyContent: "center",
    marginRight: "auto",
    marginReft: "auto",
  },
  logo: {
    width: 800,
    height: 200,
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
    height: 60,
	  width: 370,
	  backgroundColor: '#F7F7F7',
	  borderRadius: 10,
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
    height: 60,
    width: 370,
    marginLeft: "auto",
	  marginRight: "auto",
    backgroundColor: '#FF7A70',
    borderRadius: 10,
    fontSize: 36,
    marginTop: 4,
    marginBottom: 20,
    justifyContent: "center",
    alignContent: "center",
  },
  buttontext: {
    fontSize: 36,
    alignContent: "center",
    justifyContent: "center",
    margin: "auto"
  },
  dropdown: {
    height: 60,
    width: 370,
    marginLeft: "auto",
	  marginRight: "auto",
    fontSize: 36,
    marginTop: 4,
    marginBottom: 20,
    justifyContent: "center",
    alignContent: "center",
  },
  dropdowntext: {
    fontSize: 24,
  },
  dropdownrow: {
    height: 0,
  },
  dropdownrowtext: {
    fontSize: 18,
  }
});

