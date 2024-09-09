import { Stack } from "expo-router";

export default function WorkspaceStack() {
    return <Stack>
        <Stack.Screen name="workspace" options={{ title: 'Workspaces'}}/>
        
    </Stack>
}