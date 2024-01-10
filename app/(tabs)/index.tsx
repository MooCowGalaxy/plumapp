import { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { usePathname } from 'expo-router';

import { Text, View } from '../../components/Themed';
import SearchProductsBar from '../../components/SearchProductsBar';
import SearchTabs from '../../components/SearchTabs';

import * as ScreenOrientation from 'expo-screen-orientation';
import Colors from '../../constants/Colors';

export default function HomeScreen() {
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchMode, setSearchMode] = useState('name'); // name || plu

    const pathname = usePathname();

    useEffect(() => {
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
            <SearchProductsBar
                isSearching={isSearching} setIsSearching={setIsSearching}
                searchText={searchText} setSearchText={setSearchText}
                searchMode={searchMode} setSearchMode={setSearchMode}
            />
            <View style={styles.contentContainer}>
                <View style={[styles.content, {display: !isSearching ? 'flex' : 'none'}]}>
                    <Text>Home page</Text>
                    <Text>Path: {pathname}</Text>
                </View>
                <View style={[styles.content, {backgroundColor: '#eee', display: isSearching ? 'flex' : 'none'}]}>
                    <SearchTabs
                        searchText={searchText} setSearchText={setSearchText}
                        searchMode={searchMode} setSearchMode={setSearchMode}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.light.background,
    },
    contentContainer: {
        flex: 1,
        position: 'relative',
    },
    content: {
        position: 'absolute',
        width: '100%',
        height: '100%',
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
