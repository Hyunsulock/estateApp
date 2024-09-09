import { Tabs } from 'expo-router'

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
export default function WorkspaceLayout() {
    return <Tabs screenOptions={{tabBarActiveTintColor: 'black'}}>
        
        <Tabs.Screen name='workspaces' 
            options={{title: 'Workspaces',  headerShown:false, tabBarIcon: ({color})=> 
            <MaterialIcons name="work" size={24} color={color} />}}/>
        <Tabs.Screen name='profile' 
            options={{title: 'Profile', headerShown:false, tabBarIcon: ({color})=> 
            <FontAwesome name="user" size={24} color={color} />}}/>
    
    
    </Tabs>
}