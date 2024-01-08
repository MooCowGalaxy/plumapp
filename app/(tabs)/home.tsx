import * as React from 'react';
import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { hasOnboarded, setOnboarding } from '../../utilities/storage';

import * as ScreenOrientation from 'expo-screen-orientation';

export default function HomeScreen() {
    const [onboarded, setOnboarded] = React.useState(false);

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
        <View style={styles.container}>
            <Text style={styles.title}>Tab One</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
            <EditScreenInfo path="app/(tabs)/home.tsx"/>
            <Button title="Enable onboarding on next cycle" onPress={() => setOnboarding(false)}/>
            <Text>Has onboarded: {onboarded ? 'yes' : 'no'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
