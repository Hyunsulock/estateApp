
import { useAuth } from '@/providers/AuthProvider'
import {Link , Redirect} from 'expo-router'
import { ActivityIndicator, Text, View} from 'react-native'
export default function Home() {

    const {session, loading, profile, setProfile} = useAuth();

    if (loading) {
        return <ActivityIndicator/>
    }

    if (!session) {
        return <Redirect href={'/sign-in'}/>
    }


    return <Redirect href="/(workspace)/workspaces"  />



    






}  