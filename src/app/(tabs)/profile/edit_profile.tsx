import { useProfile, useUpdateProfile } from "@/api/profile";
import Button from "@/components/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { TextInput, View, StyleSheet, Alert, Text, ScrollView, ImageBackground } from "react-native";
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import RemoteImage from "@/components/RemoteImage";

const EditProfileScreen = () => {
    const defalutImageUri = "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";
    const [username, setUsername] = useState('');
    const [full_name, setFullName] = useState('');
    const { session, loading, profile } = useAuth();
    const [errors, setErrors] = useState('');
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);
    const { data: profileData } = useProfile(profile.id);
    const { mutate: updateProfile } = useUpdateProfile();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (profileData) {
            setUsername(profileData.username);
            setFullName(profileData.full_name);
            setAvatarUrl(profileData.avatar_url);
        }
    }, [profileData]);

    const resetFields = () => {
        setUsername('');
        setFullName('');
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatarUrl(result.assets[0].uri);
        }
    };

    const uploadImage = async () => {
        if (!avatar_url?.startsWith('file://')) {
            return;
        }

        const base64 = await FileSystem.readAsStringAsync(avatar_url, {
            encoding: 'base64',
        });
        const filePath = `${randomUUID()}.png`;
        const contentType = 'image/png';

        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(filePath, decode(base64), { contentType });

        if (data) {
            return data.path;
        }
    };

    const validateInput = () => {
        if (!username) {
            setErrors('No username');
            return false;
        }
        if (!full_name) {
            setErrors('No full name');
            return false;
        }
        return true;
    };

    const onCreate = async () => {
        if (!validateInput()) {
            Alert.alert('Invalid input', errors);
            return;
        }

        setIsLoading(true);

        const imagePath = await uploadImage();

        let updateFields = {
            full_name: full_name,
            username: username,
            avatar_url: imagePath,
            workspace: profile.workspace,
        };

        updateProfile(
            {
                id: profile.id,
                ...updateFields,
            },
            {
                onSuccess: () => {
                    setIsLoading(false);
                    resetFields();
                },
            }
        );
        router.back();
    };

    return (
        <ImageBackground source={require('../../../../assets/waiting.jpg')} style={styles.background}>
            <View style={styles.container}>
                <Stack.Screen options={{ title: 'Edit profile' }} />
                <ScrollView>
                    <View style={styles.imageContainer}>
                        <RemoteImage
                            path={avatar_url}
                            fallback={defalutImageUri}
                            style={styles.avatar}
                            dataLink="avatars"
                            resizeMode="contain"
                        />
                    </View>
                    <Text onPress={pickImage} style={styles.selectImageText}>
                        Select image
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Username"
                    />
                    <TextInput
                        style={styles.input}
                        value={full_name}
                        onChangeText={setFullName}
                        placeholder="Full name"
                    />
                    {!isLoading ? (
                        <Button onPress={onCreate} text={'Edit Profile'} />
                    ) : (
                        <Text>Loading</Text>
                    )}
                </ScrollView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        height: '100%',
    },
    container: {
        marginHorizontal: 8, // mx-2
    },
    imageContainer: {
        marginHorizontal: 8, // mx-2
        marginVertical: 16, // my-4
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: '50%', // w-1/2
        aspectRatio: 1, // aspect-[4/4]
        borderRadius: 9999, // rounded-full
    },
    selectImageText: {
        fontSize: 18, // Equivalent to text-lg
        textAlign: 'center',
        fontWeight: '600', // font-semibold
        color: '#3B82F6', // text-blue-500
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        marginHorizontal: 10,
    },
});

export default EditProfileScreen;
