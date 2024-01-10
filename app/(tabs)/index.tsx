import * as React from 'react';
import { Button, StyleSheet, SafeAreaView } from 'react-native';
import { usePathname } from 'expo-router';

import { Text, View } from '../../components/Themed';
import SearchProductsBar from '../../components/SearchProductsBar';
import { hasOnboarded, setOnboarding } from '../../utilities/storage';

import * as ScreenOrientation from 'expo-screen-orientation';
import Colors from "../../constants/Colors";

export default function HomeScreen() {
    const [onboarded, setOnboarded] = React.useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
        hasOnboarded()
            .then(res => setOnboarded(res));

        ScreenOrientation.getOrientationLockAsync()
            .then(res => {
                if (res !== ScreenOrientation.OrientationLock.PORTRAIT_UP) {
                    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
                        .then();
                }
            });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <SearchProductsBar />
            <Text style={styles.title}>Tab One</Text>
            <Text>{pathname}</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
            <Button title="Enable onboarding on next cycle" onPress={() => setOnboarding(false)}/>
            <Text>Has onboarded: {onboarded ? 'yes' : 'no'}</Text>
            <Text>Is dev environment: {__DEV__ ? 'yes' : 'no'}</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
