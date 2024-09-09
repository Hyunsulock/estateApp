import { Stack, Tabs,  } from "expo-router";
import AuthProvider from "../providers/AuthProvider";


import QueryProvider from "../providers/QueryProvider";
export default function RootLayout() {
    
    return (
        <AuthProvider>
            <QueryProvider>
                <Stack screenOptions={{headerShown: false}}/>
            </QueryProvider>
        </AuthProvider>
    )
    
    
    
}