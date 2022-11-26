import { Component, createRef } from 'react';
import { Picker } from '@react-native-picker/picker';
import { ImageBackground, KeyboardAvoidingView, View, Text, 
         TextInput, Image, StyleSheet, Pressable, ScrollView
       } from 'react-native';

global.userId = -1;
global.firstName = '';
global.lastName = '';
global.email = '';
global.loginName = '';
global.password = '';
global.question = '';
global.answer = '';

const lastRef = createRef();
const emailRef = createRef();
const userRef = createRef();
const passRef = createRef();
const ansRef = createRef();

const questions = [
  "What is your father's middle name?", 
  "What was the name of your high school?", 
  "What is the name of your first pet?"
];

export default class RegisterScreen extends Component {

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
      <ImageBackground
        source={ require('../assets/backgroundmobilefinal.png') }
        resizeMode='cover'
        style={ {alignItems: "center", flex: 1, justifyContent: "center"} }> 
        
        <KeyboardAvoidingView 
          behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
          style={ styles.container }>
          <ScrollView 
            showsVerticalScrollIndicator={ false } 
            style={{ flex:1, paddingTop: 100 }} 
            keyboardDismissMode="interactive"
            contentContainerStyle={styles.container}>
          
          <Image style={ styles.logo } source={ require('../assets/logo.png') }/>
          
          <View style={ styles.container }>
            <View style={ styles.registerboxfield }>
              <View style= { styles.zblock }>

                <Text style={ styles.titlefield }>Create an account</Text>

                <TextInput
                  clearButtonMode="while-editing"
                  returnKeyType='next'
                  spellCheck = { false }
                  textContentType='givenName'
                  style={ styles.inputfield }
                  placeholder="First name"
                  placeholderTextColor= '#808080'
                  onChangeText={ (val) => {this.changeFirstNameHandler(val)} }
                  onSubmitEditing={ () => {lastRef.current.focus();} }
                  blurOnSubmit={ false }
                  /> 

                <TextInput
                  ref={ lastRef }
                  clearButtonMode="while-editing"
                  returnKeyType='next'
                  spellCheck = { false }
                  textContentType='familyName'
                  style={ styles.inputfield }
                  placeholder="Last name"
                  placeholderTextColor= '#808080'
                  onChangeText={ (val) => {this.changeLastNameHandler(val)} }
                  onSubmitEditing={ () => {emailRef.current.focus();} }
                  blurOnSubmit={ false }
                  />   
                
                <TextInput
                  ref={ emailRef }
                  clearButtonMode="while-editing"
                  returnKeyType='next'
                  keyboardType='email-address'
                  spellCheck={ false }
                  textContentType='emailAddress'
                  style={ styles.inputfield }
                  placeholder="Email"
                  placeholderTextColor= '#808080'
                  onChangeText={ (val) => {this.changeEmailHandler(val)} }
                  onSubmitEditing={ () => {userRef.current.focus();} }
                  blurOnSubmit={ false }
                  />        
                
                <TextInput
                  ref={ userRef }
                  clearButtonMode="while-editing"
                  returnKeyType='next'
                  spellCheck={ false }
                  textContentType='username'
                  style={ styles.inputfield }
                  placeholder="Username"
                  placeholderTextColor= '#808080'
                  onChangeText={ (val) => {this.changeLoginNameHandler(val)} }
                  onSubmitEditing={ () => {passRef.current.focus();} }
                  blurOnSubmit={ false }
                  />

                <TextInput
                  ref={ passRef }
                  clearButtonMode="while-editing"
                  returnKeyType='next'
                  spellCheck={ false }
                  autoCorrect={ false }
                  textContentType='password'
                  style={ styles.inputfield }
                  placeholder="Password"
                  placeholderTextColor= '#808080'
                  secureTextEntry={ true }
                  onChangeText={ (val) => {this.changePasswordHandler(val)} }
                  onSubmitEditing={ () => {ansRef.current.focus();} }
                  blurOnSubmit={ false }
                />
                
                <Text style={ styles.explainText }>Security Question:</Text> 
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
                      global.question = itemIndex;
                    }
                  }>
                  <Picker.Item label="What is your father's middle name?" value='0' />
                  <Picker.Item label="What was the name of your high school?" value='1' />
                  <Picker.Item label="What is the name of your first pet?" value='2' />
                </Picker>
              </View>

              <View style= { styles.zblock }>

                  <TextInput
                    ref={ ansRef }
                    clearButtonMode="while-editing"
                    returnKeyType='done'
                    style={ styles.inputfield }
                    placeholder="Answer"
                    placeholderTextColor= '#808080'
                    secureTextEntry={ true }
                    onChangeText={ (val) => {this.changeAnswerHandler(val)} }
                    blurOnSubmit={ false }
                  />

                <Text style={ styles.error }>
                  { this.state.message }
                </Text>
              </View>

              <Pressable 
                style={ styles.registerbuttonfield }
                onPress={ this.handleClickRegister }> 
                <Text style={ styles.buttontext }>Register</Text> 
              </Pressable>
            </View>

            

          </View>
          <Pressable 
            style={ styles.loginbuttonfield }
            onPress={ this.handleClickLogin }>
            <Text style={ styles.buttontext }>Log In</Text>
          </Pressable>  
          </ScrollView>
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
        this.setState({message: res.error});
      }
      else
      {
        this.sendCode(obj);
        this.props.navigation.navigate('Verify', { id:res.id, firstName: res.firstName, lastName: res.lastName,
          username: res.username, email: res.email });
      }
    }
    catch(e)
    {
      this.setState({message: e.message});
    }
  }  

  sendCode = async (registerInfo) =>
  {
    try
    {
      var obj = {email:registerInfo.email};
      var js = JSON.stringify(obj);
      console.log(email);

      const response = await fetch('https://recipeprojectlarge.herokuapp.com/api/codecreation',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());

      if( res.error !== '' )
      {
        console.log("Error sending. Please resend");
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
    marginTop: 20,
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
    textAlign: "center",
    marginTop: 5,
  },
  
  error: {
    fontSize: 15,
    color: '#ff0000',
    justifyContent: "center",
    textAlign: "center",
  },
});

