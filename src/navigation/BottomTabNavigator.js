import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../Home'
import LikeScreen from '../LikesScreen'
import { FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
    screenOptions={{
        tabBarActiveTintColor: '#3e4aae',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { borderTopWidth: 0},
      }}
    >
      <Tab.Screen name="Home" component={Home} 
      
      options = {{
        headerShown: false,
        tabBarIcon: ({focused,color, size }) => <FontAwesome name="home" size={size} color={color}
        
         />
      }}
      
      />
      <Tab.Screen name="Like" component={LikeScreen} 
      options = {{
        headerShown: false,
        tabBarIcon: ({focused,  color, size }) => 
          <FontAwesome name={focused ? "heart" : "heart-o"} size={size} color={color} />
      }}
      />
    </Tab.Navigator>
  );
}
