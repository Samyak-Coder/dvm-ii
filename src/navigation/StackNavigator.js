import Details from '../Details'
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

export default function StackNavigator(){
    return (
    <Stack.Navigator initialRouteName="MainTabs" >
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
    <Stack.Screen name= 'Details' component={Details}  options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}