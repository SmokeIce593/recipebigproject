import React, { Component, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { 
  ImageBackground, KeyboardAvoidingView, View, Text, 
  TextInput, Image, StyleSheet, Pressable
} from 'react-native';

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
       message: ' ',
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
          <View style= {styles.zblock}>
            <View style={{alignItems: 'center'}}>
            <View style= {styles.zblock}>
            <Text style={styles.titlefield}>Create an account</Text>
            <Text style={{fontSize:10}}> </Text>

            <TextInput
                style={styles.inputfield}
                placeholder="First name"
                placeholderTextColor= "#808080"
                onChangeText={(val) => { this.changeFirstNameHandler(val) }}
                />        
           
            <Text style={{fontSize:10}}> </Text>

            <TextInput
                style={styles.inputfield}
                placeholder="Last name"
                placeholderTextColor= "#808080"
                onChangeText={(val) => { this.changeLastNameHandler(val) }}
                />   

            <Text style={{fontSize:10}}> </Text>

            <TextInput
                style={styles.inputfield}
                placeholder="Email"
                placeholderTextColor= "#808080"
                onChangeText={(val) => { this.changeEmailHandler(val) }}
                />        
           
            <Text style={{fontSize:10}}> </Text>
              <TextInput
                style={styles.inputfield}
                placeholder="Username"
                placeholderTextColor= "#808080"
                onChangeText={(val) => { this.changeLoginNameHandler(val) }}
                />        
           
            <Text style={{fontSize:10}}> </Text>

            <View style={{ flexDirection:'center', zIndex: 1, elevation: 1 }}>
              <TextInput
                style={styles.inputfield}
                placeholder="Password"
                placeholderTextColor= "#808080"
                secureTextEntry={true}
                onChangeText={(val) => { this.changePasswordHandler(val) }}
              />
            </View>
            
              <Text style={styles.explainText}>Security Question:</Text>
            </View>
            

            <View style ={{ zIndex: 0, elevation: 0 }}>
              <Picker
                style={styles.picker}
                itemStyle={styles.item}
                selectedValue={this.state.question}
                onValueChange={(itemValue, itemIndex) =>
                  {        
                    this.setState({question: itemValue})
                    global.question = itemIndex;
                  }

                }>
                <Picker.Item label="What is your father's middle name?" value="0" />
                <Picker.Item label="What was the name of your high school?" value="1" />
                <Picker.Item label="What is the name of your first pet?" value="2" />
              </Picker>
            </View>


            <Text style={{fontSize:10}}> </Text>
          <View style= {styles.zblock}>
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
              <View style={{alignItems: 'center'}}>
                <Text style={styles.buttontext}>Register</Text>
              </View>
            </Pressable>

          </View>
          </View>
          </View>
          <Text style={{fontSize:40}}> </Text>
          
            <Pressable style={styles.loginbuttonfield} onPress={this.handleClickLogin}>
              <View style={{alignItems: 'center'}}>
                <Text style={styles.buttontext}>Log In</Text>
              </View>
            </Pressable>
        </View>
        
      </View>
      </KeyboardAvoidingView>
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
    global.question = questions.findIndex(q => q.value == val)
  } 

}

const questions = [
  "What is your father's middle name?", 
  "What was the name of your high school?", 
  "What is the name of your first pet?"
];

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
    height: 35,
	  width: 300,
	  backgroundColor: '#F7F7F7',
	  borderRadius: 10,
    borderWidth: 1, //this is the border for input fields since react native shadow is weird
	  marginTop: 4,
	  marginBottom: 4,
	  display: "flex",
    	flexDirection: "column",
	  justifyContent: "center",
	  fontSize: 22,
	  marginRight: "auto",
	  marginLeft: "auto",
    paddingLeft: 10,
    paddingRight: 10,
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
  picker: {
    height: 50,
    width: 370,
    marginLeft: "auto",
	  marginRight: "auto",
    marginTop: 1,
    marginBottom: 20,
    justifyContent: "center",
    alignContent: "center",
  },
  item: {
    fontSize: 17,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  dropdowntext: {
    fontSize: 24,
  },
  dropdownrow: {
    height: 0,
  },
  dropdownrowtext: {
    fontSize: 18,
  },
  explainText: {
    fontSize: 20,
    textAlign: "center",
  },
  zblock: {
    zIndex: 1,
    elevation: 1,
    backgroundColor: '#EAFCFF',
    width: 350,
    paddingTop: 10,
    paddingBottom: 5,
  },
});

