import { useWorkspace } from "@/api/workspaces";
import Button from "@/components/button";
import RemoteImage from "@/components/RemoteImage";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, View, Text, ImageBackground, StyleSheet } from "react-native";

    const WorkspaceDetailsScreen = () => {
    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);

    const { data: workspace, error, isLoading } = useWorkspace(id);
    const { session, loading, profile, setProfile } = useAuth();
    const defaultImageUri = "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";

    const confirmAccess = () => {
    Alert.alert('Confirm', 'Are you sure you want to access following workspace?', [
        { text: 'No' },
        { text: 'Yes', style: 'default', onPress: onPress }
    ]);
    };

    const onPress = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .update({ workspace: workspace.id })
        .eq('id', profile.id)
        .select();

    if (error) {
        throw new Error('failed to update profile');
    }
    setProfile(data[0]);

    router.replace('/');
    };

    if (isLoading) {
    return <ActivityIndicator />;
    }

    if (error) {
    return <Text>Failed to fetch workspace</Text>;
    }

    return (
    <View style={styles.container}>
        <ImageBackground source={require('../../../../assets/waiting.jpg')} style={styles.backgroundImage}>
            <Stack.Screen options={{ title: 'Workspace detail', headerTransparent: true }} />
            <View style={styles.contentContainer}>
                <Text style={styles.groupText}>Group workspace</Text>
                <Text style={styles.workspaceName}>{workspace.name}</Text>
                <Text style={styles.description}>#{workspace.description}</Text>
                <View style={styles.ownerContainer}>
                    {workspace.owner_profile.avatar_url ? (
                        <RemoteImage
                            path={workspace.owner_profile.avatar_url}
                            fallback={defaultImageUri}
                            style={styles.avatar}
                            dataLink='avatars'
                            resizeMode="contain"
                        />
                    ) : null}
                    {workspace.owner_profile.username ? (
                        <Text style={styles.username}>{workspace.owner_profile.username}</Text>
                    ) : (
                        <Text style={styles.anonymousText}>Anonymous</Text>
                    )}
                </View>
                <Button text="Access" onPress={confirmAccess} />
                <View style={styles.spacing}></View>
            </View>
        </ImageBackground>
    </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
    flex: 1,
    },
    backgroundImage: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    },
    contentContainer: {
    marginHorizontal: 12,
    flex: 1,
    justifyContent: 'flex-end',
    },
    groupText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 8,
    },
    workspaceName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginHorizontal: 8,
    },
    description: {
    fontSize: 18,
    marginBottom: 4,
    marginHorizontal: 8,
    },
    ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: 12,
    },
    avatar: {
    width: 36,
    aspectRatio: 1,
    borderRadius: 16,
    },
    username: {
    fontSize: 20,
    marginLeft: 8,
    },
    anonymousText: {
    fontSize: 16,
    color: 'gray',
    },
    spacing: {
    marginBottom: 16,
    },
    });

export default WorkspaceDetailsScreen;
