import { useAuth } from "../../providers/AuthProvider";
import { Stack, Redirect} from "expo-router";


export default function AuthLayout() {
    const {session} =  useAuth();
    if (session) {
        return <Redirect href={'/'}/>
    }
    return <Stack/>
}