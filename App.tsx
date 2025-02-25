import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { checkAuth } from './src/redux/actions/authActions';
import LoginScreen from './src/screens/login';
import HomeScreen from './src/screens/Homescreen';

const Stack = createStackNavigator();

// The main navigator component
const AppNavigator = () => {
  const dispatch = useDispatch();

  // Check if user is already logged in when app starts
  useEffect(() => {
    const checkAuthentication = async () => {
      await checkAuth(dispatch);
    };
    
    checkAuthentication();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* <Stack.Screen name="SignUp" component={SignUpScreen} /> */}
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Main App component wrapped with Redux Provider
const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;