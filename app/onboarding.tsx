import * as React from 'react';
import {Button, View as DefaultView, Animated, StyleSheet, Pressable} from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';

import { Text, View } from '../components/Themed';
import PagerView, {PagerViewOnPageSelectedEvent} from 'react-native-pager-view';

import { setOnboarding } from '../utilities/storage';

export default function OnboardingScreen() {
    const [activePage, setActivePage] = React.useState(0);
    const opacityAnimation = React.useRef(new Animated.Value(1)).current;

    const onPageSelected = (event: PagerViewOnPageSelectedEvent) => {
        const page = event.nativeEvent.position;

        setActivePage(page);

        if (activePage !== 3 && page === 3) {
            Animated.timing(opacityAnimation, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start();
        } else if (activePage === 3 && page !== 3) {
            Animated.timing(opacityAnimation, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }).start();
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <PagerView style={styles.container} initialPage={0} scrollEnabled={true} onPageSelected={onPageSelected}>
                <View style={{...styles.page, backgroundColor: '#BCF4F5'}} key="1">
                    <Text style={styles.title}>Welcome to Plum, your new grocery companion!</Text>
                    <Text style={styles.text}>Find the best produce prices right at your fingertips.</Text>
                </View>
                <View style={{...styles.page, backgroundColor: '#D9F2B4'}} key="2">
                    <Text style={styles.title}>Scan or Search</Text>
                    <Text style={styles.text}>Quickly scan or start typing to evaluate prices. Your location ensures accuracy.</Text>
                </View>
                <View style={{...styles.page, backgroundColor: '#B4EBCA'}} key="3">
                    <Text style={styles.title}>Evaluate Prices</Text>
                    <Text style={styles.text}>Get a price assessment based on your location. Explore our full list anytime.</Text>
                </View>
                <View style={{...styles.page, backgroundColor: '#FFB7C3'}} key="4">
                    <Text style={styles.title}>Make informed decisions, starting now!</Text>
                    <Text style={styles.text}>Our mission is to bring transparency to prices in grocery stores. Never overpay for groceries again!</Text>
                    <Button title="Close onboarding" onPress={() => {
                        setOnboarding(true).then(() => {
                            router.replace('/');
                        });
                    }} />
                </View>
            </PagerView>
            <DefaultView style={{...styles.overlay, top: Constants.statusBarHeight + 5, paddingVertical: 5}}>
                <DefaultView style={styles.navbar}>
                    <DefaultView style={{flex: 1}} />
                    <DefaultView style={{flex: 1, alignItems: 'center'}}>
                        <Text style={styles.icon}>Icon</Text>
                    </DefaultView>
                    <Animated.View style={[{flex: 1, alignItems: 'flex-end'}, {opacity: opacityAnimation}]}>
                        <Pressable onPress={() => {
                            if (activePage === 3) setOnboarding(true).then(() => {
                                router.replace('/');
                            });
                        }}>
                            <Text style={styles.skip}>skip</Text>
                        </Pressable>
                    </Animated.View>
                </DefaultView>
            </DefaultView>
            <DefaultView style={{...styles.overlay, bottom: 30, justifyContent: 'center', backgroundColor: '#fff'}}>

            </DefaultView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center',
        //justifyContent: 'center',
    },
    overlay: {
        position: 'absolute',
        left: 0,
        width: '100%'
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 15
    },
    icon: {
        color: '#000'
    },
    skip: {
        color: '#000'
    },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        maxWidth: '80%',
        color: '#000'
    },
    text: {
        fontSize: 24,
        fontWeight: 'normal',
        textAlign: 'center',
        maxWidth: '80%',
        color: '#000'
    },
});
