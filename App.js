
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import { I18nManager } from 'react-native';
import RNRestart from 'react-native-restart'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen'
import MembersNumberScreen from './src/screens/NewGroupScreens/MembersNumberScreen'
import MembersNameScreen from './src/screens/CreateListScreens/MembersNameScreen'
import NumGuardPostsScreen from './src/screens/CreateListScreens/NumGuardPostsScreen'
import GuardPostsNameScreen from './src/screens/CreateListScreens/GuardPostsNameScreen'
import StartTimeScreen from './src/screens/CreateListScreens/StartTimeScreen'
import EndTimeScreen from './src/screens/CreateListScreens/EndTimeScreen'
import CheckIfCyclicScreen from './src/screens/CreateListScreens/CheckIfCyclicScreen'
import CycleHourScreen from './src/screens/CreateListScreens/CycleHourScreen'
import ChooseMethodScreen from './src/screens/CreateListScreens/ChooseMethodScreen'
import GroupsNamesScreen from './src/screens/ExistingGroupsScreens/GroupsNamesScreen'
import History from './src/screens/ExistingGroupsScreens/HistoryScreen'
import ResultScreen from './src/screens/CreateListScreens/ResultScreen'
import store from './src/store'
import { Provider } from 'mobx-react';
import { StyleContextProvider } from './src/styles';

const Stack = createStackNavigator();

function App() {
  useEffect(() => {
    if(I18nManager.isRTL != true){
      I18nManager.forceRTL(true);
      RNRestart.Restart();
    }
  },[])
    return (
      <Provider store={store}>
        <StyleContextProvider>
          <NavigationContainer>
            <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}
            >
              <Stack.Screen name="HomeScreen" component={HomeScreen}/>
              
              <Stack.Screen name="ExistingGroupsScreen" component={GroupsNamesScreen}/>
              <Stack.Screen name="History" component={History}/>
  
              <Stack.Screen name="NewGroupScreen" component={MembersNumberScreen}/>

              <Stack.Screen name="CreateListScreen/MembersNameScreen" component={MembersNameScreen} />              
              <Stack.Screen name="CreateListScreen/NumGuardPostsScreen" component={NumGuardPostsScreen} />
              <Stack.Screen name="CreateListScreen/GuardPostsNameScreen" component={GuardPostsNameScreen}/>
              <Stack.Screen name="CreateListScreen/StartTimeScreen" component={StartTimeScreen}/>
              <Stack.Screen name="CreateListScreen/EndTimeScreen" component={EndTimeScreen}/>
              <Stack.Screen name="CreateListScreen/CheckIfCyclicScreen" component={CheckIfCyclicScreen}/>
              <Stack.Screen name="CreateListScreen/CycleHourScreen" component={CycleHourScreen}/>
              <Stack.Screen name="CreateListScreen/ChooseMethodScreen" component={ChooseMethodScreen}/>
              <Stack.Screen name="CreateListScreen/ResultScreen" component={ResultScreen}/>
            </Stack.Navigator>
          </NavigationContainer>
        </StyleContextProvider>
      </Provider>
    );
}


export default App
