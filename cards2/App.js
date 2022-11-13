import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import LoginScreen from './screens/LoginScreen';
import CardScreen from './screens/CardScreen';
import RegisterScreen from './screens/RegisterScreen';
export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
const AppNavigator = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      headerShown: false // Will hide header for HomePage
    }
  },
  Card: {
    screen: CardScreen,
    navigationOptions: {
      headerShown: false  // Will hide header for HomePage
    }
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      headerShown: false  // Will hide header for HomePage
    }
  },
},{
  initialRouteName: "Login"
});
const AppContainer = createAppContainer(AppNavigator);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

