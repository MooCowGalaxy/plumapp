import 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import {  useColorScheme } from 'react-native';
import { hasOnboarded } from '../utilities/storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return <RootLayoutNav/>;
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();

    useEffect(() => {
        (async () => {
            const onboarded = await hasOnboarded();

            if (!onboarded) {
                router.replace('/onboarding');
            }
        })();
    }, []);

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <GestureHandlerRootView>
                <RootSiblingParent>
                    <Stack>
                        <Stack.Screen name="(tabs)" options={{headerShown: false, headerTitle: 'Back'}} />
                        <Stack.Screen name="modal"
                                      options={{presentation: 'modal', headerBackVisible: false}} />
                        <Stack.Screen name="onboarding"
                                      options={{headerShown: false, gestureEnabled: false, animation: 'slide_from_bottom'}} />
                        <Stack.Screen name="product/[id]"
                                      options={{headerShown: false}} />
                        <Stack.Screen name="category/[id]"
                                      options={{headerShown: true}} />
                        <Stack.Screen name="more/legal/index"
                                      options={{headerShown: true, headerTitle: 'Legal'}} />
                        <Stack.Screen name="more/legal/privacy"
                                      options={{headerShown: true, headerTitle: 'Privacy Policy'}} />
                        <Stack.Screen name="more/legal/tos"
                                      options={{headerShown: true, headerTitle: 'Terms and Conditions'}} />
                        <Stack.Screen name="more/help"
                                      options={{headerShown: true, headerTitle: 'Help/FAQs'}} />
                        <Stack.Screen name="more/feedback"
                                      options={{headerShown: true, headerTitle: 'Give Feedback'}} />
                        <Stack.Screen name="more/feedbackSent"
                                      options={{headerShown: true, headerTitle: 'Thanks!'}} />
                    </Stack>
                </RootSiblingParent>
            </GestureHandlerRootView>
        </ThemeProvider>
    );
}
