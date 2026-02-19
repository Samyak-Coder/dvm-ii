import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#3e4aae', headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="LikesScreen"
        options={{
          title: 'Likes',
          tabBarIcon: ({ color, focused }) => <FontAwesome name={focused ? "heart" : "heart-o"} size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
