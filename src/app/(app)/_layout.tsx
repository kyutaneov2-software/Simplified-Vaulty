import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeLayout(){
    return(
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#fffffff'
                }
            }}>

            {/* Home Tab - maps to app/(app)/HomeScreen.tsx */}
            <Tabs.Screen
                name='HomeScreen'
                options={{
                    title: 'Home',
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="home" size={size} color={color as string }/>
                    )
                }}
            />

            {/* Profile Tab - map to app/(app)/Profile.tsx */}
            <Tabs.Screen
                name='Profile'
                options={{
                    title: 'Profile',
                    tabBarIcon: ({color, size}) => {
                        <Ionicons name="person-circle" size={size} color={color as string} />
                    }
                }}
            />
        </Tabs>
    )
}