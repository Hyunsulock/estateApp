import Button from "../../../components/button"
import { supabase } from '../../../lib/supabase';
import { router, Stack } from "expo-router"
import { useState } from "react"
import { TextInput, View, StyleSheet, Alert } from "react-native"

const CreateApartmentScreen = () => {
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [errors, setErrors] = useState('')

    const resetFields = () => {
        setAddress('')
        setName('')
    }

    const validateInput = () => {
        if (!name) {
            setErrors('No name')
            return false
        }
        if (!address) {
            setErrors('No address')
            return false
        }
        return true
    }

    const onCreate = async () => {
        if (!validateInput()) {
            console.log('invalid_input', errors)
            Alert.alert('Invalid input', errors)
            return
        }

        const { data, error } = await supabase
            .from('apartments')
            .insert([{ name: name, address: address }])
            .select()

        if (error) {
            console.log('Error uploading apartment')
        } else {
            router.back()
        }
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Create Apartment' }} />
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Apartment Name"
            />
            <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Address"
            />
            <Button onPress={onCreate} text="Create Apartment" />
        </View>
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
        marginTop: 10,
        marginBottom: 10,
        marginHorizontal: 10,
    },
})

export default CreateApartmentScreen
