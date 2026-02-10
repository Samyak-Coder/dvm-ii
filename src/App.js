import {useEffect} from 'react';
import StackNavigator from './navigation/StackNavigator';
import BottomTabNavigator from './navigation/BottomTabNavigator'
import { NavigationContainer } from '@react-navigation/native';


function App() {
  
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

export default App;
