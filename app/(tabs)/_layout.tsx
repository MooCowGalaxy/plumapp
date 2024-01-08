import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, Tabs, router } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';
import * as React from 'react';

import Colors from '../../constants/Colors';
import { hasOnboarded } from '../../utilities/storage';

// https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof Ionicons>['name'];
    color: string;
}) {
    return <Ionicons size={28} style={{marginBottom: -3}} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    React.useEffect(() => {
        (async () => {
            const onboarded = await hasOnboarded();

            if (!onboarded) {
                router.replace('/onboarding');
            }
        })();
    }, []);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                tabBarShowLabel: false
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color}) => <TabBarIcon name="home-outline" color={color} />,
                    headerRight: () => (
                        <Link href="/modal" asChild>
                            <Pressable>
                                {({pressed}) => (
                                    <Ionicons
                                        name="information-circle-outline"
                                        size={25}
                                        color={Colors[colorScheme ?? 'light'].text}
                                        style={{marginRight: 15, opacity: pressed ? 0.5 : 1}}
                                    />
                                )}
                            </Pressable>
                        </Link>
                    ),
                }}
            />
            <Tabs.Screen
                name="two"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({color}) => <TabBarIcon name="settings-outline" color={color} />,
                }}
            />
        </Tabs>
    );
}
