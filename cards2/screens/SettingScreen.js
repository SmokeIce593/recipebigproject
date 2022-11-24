import { Component, createRef } from 'react';
import { Picker } from '@react-native-picker/picker';
import { ImageBackground, KeyboardAvoidingView, View, Text, 
         TextInput, Image, StyleSheet, Pressable, Keyboard
       } from 'react-native';

const questions = [
  "What is your father's middle name?", 
  "What was the name of your high school?", 
  "What is the name of your first pet?"
];

export default class SettingScreen extends Component {

  constructor() 
  {
    super()
    this.state = 
    {
       message: ' ',

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
      password:navigation.getParam('password', ''),
    }

    return(
      <ImageBackground
        source={ require('../assets/backgroundmobilefinal.png') }
        resizeMode='cover'
        style={ {alignItems: "center", flex: 1, justifyContent: "center"} }> 
        
        <KeyboardAvoidingView 
          behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
          style={ styles.container }>
          
          <View style={ styles.container }>
            <View style={ styles.registerboxfield }>
              <View style= { styles.zblock }>

                <Text style={ styles.titlefield }>Account Settings</Text>

                <Text style={ styles.explainText }>First name:</Text>
                <TextInput
                  clearButtonMode="while-editing"
                  returnKeyType='done'
                  spellCheck = { false }
                  textContentType='givenName'
                  style={ styles.inputfield }
                  placeholder="First name"
                  defaultValue={ userInfo.firstName }
                  placeholderTextColor= '#808080'
                  onChangeText={ (val) => {this.changeFirstNameHandler(val, userInfo)} }
                  blurOnSubmit={ false }
                  /> 

                <Text style={ styles.explainText }>Last name:</Text>
                <TextInput
                  clearButtonMode="while-editing"
                  returnKeyType='done'
                  spellCheck = { false }
                  textContentType='familyName'
                  style={ styles.inputfield }
                  placeholder="Last name"
                  defaultValue={ userInfo.lastName }
                  placeholderTextColor= '#808080'
                  onChangeText={ (val) => {this.changeLastNameHandler(val, userInfo)} }
                  blurOnSubmit={ false }
                  />    
                
                <Text style={ styles.explainText }>Username:</Text>
                <TextInput
                  clearButtonMode="while-editing"
                  returnKeyType='done'
                  spellCheck={ false }
                  textContentType='username'
                  style={ styles.inputfield }
                  placeholder="Username"
                  defaultValue={ userInfo.username }
                  placeholderTextColor= '#808080'
                  onChangeText={ (val) => {this.changeLoginNameHandler(val, userInfo)} }
                  blurOnSubmit={ false }
                  />

                <Text style={ styles.explainText }>Password:</Text>
                <TextInput
                  clearButtonMode="while-editing"
                  returnKeyType='done'
                  spellCheck={ false }
                  autoCorrect={ false }
                  textContentType='password'
                  style={ styles.inputfield }
                  defaultValue={ userInfo.password }
                  placeholder="Password"
                  placeholderTextColor= '#808080'
                  secureTextEntry={ true }
                  onChangeText={ (val) => {this.changePasswordHandler(val, userInfo)} }
                  blurOnSubmit={ false }
                />

              </View>

                <Text style={ styles.error }>
                  { this.state.message }
                </Text>

              <Pressable 
                style={ styles.registerbuttonfield }
                onPress={() => this.handleClickSave(userInfo) }> 
                <Text style={ styles.buttontext }>Save changes</Text> 
              </Pressable>
            </View>
          </View>
      </KeyboardAvoidingView>

      <Pressable 
        style={ styles.loginbuttonfield }
        onPress={ this.handleClickCancel }>
        <Text style={ styles.buttontext }>Cancel</Text>
      </Pressable>
      
    </ImageBackground>
  );
  }

  handleClickCancel = async () =>
  {
    this.props.navigation.navigate('Search');
  }  

  handleClickSave = async (userInfo) =>
  {

    try
    {
      var obj = {login:userInfo.username.trim(), password:userInfo.password.trim(), email:userInfo.email.trim(),
                 firstname:userInfo.firstName.trim(), lastname:userInfo.lastName.trim(), id:userInfo.id};
      var js = JSON.stringify(obj);

      const response = await fetch('https://recipeprojectlarge.herokuapp.com/api/updateinformation',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());

      if( res.error !== "" )
      {
        console.log(res.error)
        this.setState({message: res.error});
      }
      else
      {
        userInfo.firstName = res.firstName;
        userInfo.lastName = res.lastName;
        userInfo.username = res.username;
        this.props.navigation.navigate('Search', userInfo);
      }
    }
    catch(e)
    {
      this.setState({message: e.message});
    }
  }  

  changeLoginNameHandler = async (val, userInfo) =>
  {
    userInfo.username = val;
  }  

  changePasswordHandler = async (val, userInfo) =>
  {
    userInfo.password = val;
  }  

  changeFirstNameHandler = async (val, userInfo) =>
  {
    userInfo.firstName = val;
  } 

  changeLastNameHandler = async (val, userInfo) =>
  {
    userInfo.lastName = val;
  } 

  changeEmailHandler = async (val, userInfo) =>
  {
    userInfo.email = val;
  } 


}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerboxfield: {
    backgroundColor: '#EAFCFF',
    borderColor: '#000000',
    borderRadius: 21,
    borderWidth: 2,
    alignItems: "center",
    position: "center",
    marginTop: 10,
    marginLeft: "auto",
    marginRight: "auto",
  },
  zblock: {
    width: 350,
    backgroundColor: '#EAFCFF',
    borderRadius: 21,
    paddingTop: 8,
    paddingBottom: 5,
    zIndex: 1,
    elevation: 1,
  },
  logo: {
    width: 400,
    height: 100,
    justifyContent: "center",
    
  },
  titlefield: {
    fontSize: 36,
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    marginTop: 4,
  },
  inputfield: {
    height: 42,
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
  registerbuttonfield: {
    height: 50,
	  width: 300,
    marginLeft: "auto",
	  marginRight: "auto",
    backgroundColor: '#FF7A70',
    borderRadius: 17,
    fontSize: 36,
    marginTop: 0,
    marginBottom: 15,
    justifyContent: "center",
    alignContent: "center",
    marginRight: "auto",
    marginLeft: "auto",
    borderWidth: 1,
    borderColor: '#000000'
  },
  loginbuttonfield: {
    height: 50,
	  width: 300,
    marginLeft: "auto",
	  marginRight: "auto",
    backgroundColor: '#FF7A70',
    borderRadius: 17,
    fontSize: 36,
    marginTop: 10,
    marginBottom: 15,
    justifyContent: "center",
    alignContent: "center",
    marginRight: "auto",
    marginLeft: "auto",
    borderWidth: 1,
    borderColor: '#000000'
  },
  buttontext: {
    fontSize: 36,
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
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
  question: {
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
    textAlign: "left",
    marginLeft: 30,
  },
  
  error: {
    fontSize: 15,
    color: '#ff0000',
    justifyContent: "center",
    textAlign: "center",
  },
});

