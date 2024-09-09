
import { useWorkspaceList } from '@/api/workspaces';
import Button from '@/components/button';
import WorkspaceItem from '@/components/workspaceListItem';
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider';
import {Link, Redirect, router } from 'expo-router'
import { useEffect } from 'react'
import {ActivityIndicator, FlatList, ImageBackground, Pressable, Text, StyleSheet} from 'react-native'
import { ScrollView, View } from 'react-native'

export default function WorkspaceScreen() {

  const {session, loading, profile, setProfile, setChecking} = useAuth();


    const fetchProfile = async () => {
            if (!session) {
                return;
            }

            let profile_data = null

            while (!profile_data) {
                console.log(profile_data)
                const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                if (error) {
                    console.error('Error fetching profile:', error);
                } else {
                    console.log('data',data)
                    setChecking({...data})
                    console.log("-----------")
                    profile_data = data

                }
            }

            

        } 

  if (profile) {
    if (profile.workspace) {
      return <Redirect href={'/(tabs)/products'}/>
    }
  } else {
    fetchProfile()
  }

  const { data: workspaces, error, isLoading } = useWorkspaceList();



  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch workspaces</Text>;
  }

  return (
    <>
      <ImageBackground style={styles.fullHeight} source={require('../../../../assets/waiting.jpg')} >
      

        <View className='mx-3 '>
            <Button onPress={()=> {
                router.navigate('/(workspace)/workspaces/create');
            }}
            text='Create workspace'>

            </Button>
        </View>
        <FlatList
        data={workspaces}
        renderItem={({ item }) => <WorkspaceItem workspace={item}/>}
        contentContainerStyle={{ gap: 2, padding: 10 }}
        />
        </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  fullHeight: {
    height: '100%', // Equivalent to h-full in TailwindCSS
  },
});