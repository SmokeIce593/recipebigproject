import React from 'react';
import { StyleSheet, Text, View, Image  } from 'react-native';
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import LoginScreen from './screens/LoginScreen';
import SearchScreen from './screens/SearchScreen';
import RegisterScreen from './screens/RegisterScreen';
import CreateScreen from './screens/CreateScreen';
import RecipeScreen from './screens/RecipeScreen';
import SettingScreen from './screens/SettingScreen';
import RecoverScreen from './screens/RecoverScreen';

export default class App extends React.Component {
  render() {
    return <AppContainer/>;
  }
}
const AppNavigator = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      headerShown: false // Will hide header for HomePage
    }
  },
  Recover: {
    screen: RecoverScreen,
    navigationOptions: {
      headerShown: false // Will hide header for HomePage
    }
  },
  Search: {
    screen: SearchScreen,
    navigationOptions: {
      title: '',
      headerShown: true,  // Will hide header for HomePage
      headerLeft: ()=> null,
      headerStyle: {
        height: 100,
        backgroundColor: '#93B7BE'
      },
      headerTitle: () => (
        <Image style={{ width: 200, height: 52, }} source={require('./assets/logo.png')}/>
      ),
    }
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      headerShown: false  // Will hide header for HomePage
    }
  },
  Recipe: {
    screen: RecipeScreen,
    navigationOptions: {
      title: '',
      headerShown: true,  // Will hide header for HomePage
      headerLeft: ()=> null,
      headerStyle: {
        height: 100,
        backgroundColor: '#93B7BE'
      },
      headerTitle: () => (
        <Image style={{ width: 200, height: 52, }} source={require('./assets/logo.png')}/>
      ),
    }
  },
  Create: {
    screen: CreateScreen,
    navigationOptions: {
      title: '',
      headerShown: true,  // Will hide header for HomePage
      headerLeft: ()=> null,
      headerStyle: {
        height: 100,
        backgroundColor: '#93B7BE'
      },
      headerTitle: () => (
        <Image style={{ width: 200, height: 52, }} source={require('./assets/logo.png')}/>
      ),
    }
  },
  Setting: {
    screen: SettingScreen,
    navigationOptions: {
      title: '',
      headerShown: true,  // Will hide header for HomePage
      headerLeft: ()=> null,
      headerStyle: {
        height: 100,
        backgroundColor: '#93B7BE'
      },
      headerTitle: () => (
        <Image style={{ width: 200, height: 52, }} source={require('./assets/logo.png')}/>
      ),
    }
  },
},{
  initialRouteName: "Recover"
});
const AppContainer = createAppContainer(AppNavigator);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 1,
    height: 4,
    justifyContent: "center",
    alignItems: 'center',
  },
});

