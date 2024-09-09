import { Tabs } from 'expo-router'

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
export default function TabsLayout() {
    return <Tabs screenOptions={{tabBarActiveTintColor: 'black'}}>
        
        <Tabs.Screen name='products' 
            options={{title: 'Products', headerShown:false, tabBarIcon: ({color})=> 
            <FontAwesome6 name="house-flag" size={24} color={color} />}}/>


        <Tabs.Screen name='profile' 
            options={{title: 'Profile', headerShown:false, tabBarIcon: ({color})=> 
            <FontAwesome name="user" size={24} color={color} />}}/>
    
    
    </Tabs>
}