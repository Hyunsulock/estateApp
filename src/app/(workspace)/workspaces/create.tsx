import { useInsertWorkspace } from '@/api/workspaces';
import Button from '@/components/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useState } from 'react';
import { Text, TextInput, View, Image, ImageBackground} from 'react-native'
import { StyleSheet, ScrollView } from 'react-native'

const CreateWorkspaceScreen = () =>{
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors]=  useState('')
    const {session, loading, profile, setProfile} = useAuth();
    const {data,  mutateAsync: insertWorkspace, isSuccess} = useInsertWorkspace();
    const [isLoading, setIsLoading] = useState(false)



    const resetFields = () => {
        setName('');
        setDescription('')
        
    }



    const validateInput = () => {
        if(!name) {
            setErrors('No Name')
            return false;
        }
        if(!description) {
            setErrors('No description')
            return false;
        }
        return true;
    }

    const onCreate = async () => {
        if(!validateInput()) {
            return;
        }

        setIsLoading(true)

        let result: any = await insertWorkspace({name, description, owner: profile.id, })
        
        result[0].id

        const { data, error } = await supabase
        .from('profiles')
        .update({ workspace: result[0].id })
        .eq('id', profile.id)
        .select();

        if (error) {
            throw new Error('supabase profile update error')
        }

        

        setProfile(data[0])

        setIsLoading(false)
        resetFields();

        router.replace('/')
  
    }


    return (
        <ImageBackground style={styles.fullHeight} source={require('../../../../assets/waiting.jpg')} >
            <View style={styles.container}>
                <ScrollView>
                <Stack.Screen options={{title: 'create workspace'}}/>
                <TextInput 
                    style={styles.input}  
                    placeholder='Name'
                    value={name}
                    onChangeText={setName}/>
                <TextInput 
                    style={styles.input} 
                    placeholder='Description' 
                    value={description}
                    onChangeText={setDescription}/>
                    {
                        !isLoading ? <Button onPress={onCreate} text={'Create'}/>:  <Text>Loading</Text>
                    }
                
                </ScrollView>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },

    input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 20,
        marginHorizontal: 10
    },
    label: {
        color: 'grey',
        fontSize: 16
    },
    fullHeight: {
        height: '100%', // Equivalent to h-full in TailwindCSS
    },
})




export default CreateWorkspaceScreen