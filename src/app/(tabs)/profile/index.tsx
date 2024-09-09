import { Link, router, Stack } from 'expo-router';
import { ImageBackground, Pressable, Text, View, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import Button from '@/components/button';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '@/providers/AuthProvider';
import { useProfile, useUpdateProfile } from '@/api/profile';
import RemoteImage from '@/components/RemoteImage';
import { useState } from 'react';

export default function User() {
    const { session, loading, profile, setProfile, setSession } = useAuth();
    const { data: profileData, error, isLoading } = useProfile(profile.id);
    const defaultImageUri = "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";
    const [isLoadingP, setIsLoading] = useState(false);
    const { mutate: updateProfile } = useUpdateProfile();

    if (!profileData) {
        return (
            <View>
                <Text>Invalid ID</Text>
            </View>
        );
    }

    const onLeave = async () => {
        setIsLoading(true);

        let updateFields = {
            full_name: profileData.full_name,
            username: profileData.username,
            avatar_url: profileData.avatar_url,
            workspace: null,
        };

        updateProfile(
            {
                id: profile.id,
                ...updateFields,
            },
            {
                onSuccess: () => {
                    setIsLoading(false);
                },
            }
        );
        setProfile({ ...profile, workspace: null });
        router.replace('/(workspace)/workspaces');
    };

    return (
        <ImageBackground source={require('../../../../assets/waiting.jpg')} style={styles.background}>
            <View style={styles.container}>
                <Stack.Screen
                    options={{
                        title: 'Profile',
                        headerRight: () => (
                            <Link href={'/(tabs)/profile/edit_profile'} asChild>
                                <Pressable>
                                    {({ pressed }) => (
                                        <FontAwesome
                                            name="pencil"
                                            size={25}
                                            color="black"
                                            style={{ marginRight: 1, opacity: pressed ? 0.5 : 1 }}
                                        />
                                    )}
                                </Pressable>
                            </Link>
                        ),
                    }}
                />
                <View style={styles.imageContainer}>
                    <RemoteImage
                        path={profileData.avatar_url}
                        fallback={defaultImageUri}
                        style={styles.avatar}
                        dataLink="avatars"
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Full Name: {profileData.full_name}</Text>
                    <Text style={styles.infoText}>Username: {profileData.username}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        onPress={async () => {
                            await supabase.auth.signOut();
                            setSession(null);
                            router.replace('/');
                        }}
                        text="Sign out"
                    />
                </View>
                <View style={styles.buttonContainer} key={'onLeave'}>
                    {!isLoadingP ? (
                        <Button onPress={onLeave} text="Leave workspace" />
                    ) : (
                        <Text>On Loading</Text>
                    )}
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        height: '100%',
    },
    container: {
        flex: 1,
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
    infoContainer: {
        marginHorizontal: 8, // mx-2
    },
    infoText: {
        fontSize: 18, // text-lg
        borderWidth: 1, // border
        borderColor: '#D1D5DB', // border-gray-300
        borderRadius: 8, // rounded-md
        marginVertical: 8, // my-2
        paddingHorizontal: 16, // px-4
        paddingVertical: 8, // py-2
        backgroundColor: '#F1F5F9', // bg-slate-50
    },
    buttonContainer: {
        marginHorizontal: 8, // mx-2
    },
});


