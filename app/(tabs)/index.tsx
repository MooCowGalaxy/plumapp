import { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';

import { Text, View } from '../../components/Themed';
import TrendingItem from '../../components/TrendingItem';
import SearchProductsBar from '../../components/SearchProductsBar';
import SearchTabs from '../../components/SearchTabs';
import fetchApi from '../../utilities/fetch';

import * as ScreenOrientation from 'expo-screen-orientation';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchMode, setSearchMode] = useState('name'); // name || plu

    const [isLoading, setLoading] = useState(true);
    const [trending, setTrending] = useState([0, 0, 0, 0, 0, 0]);

    const router = useRouter();

    useEffect(() => {
        ScreenOrientation.getOrientationLockAsync()
            .then(res => {
                if (res !== ScreenOrientation.OrientationLock.PORTRAIT_UP) {
                    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
                        .then();
                }
            });

        fetchApi('/data/featured', 'GET')
            .then(res => {
                setLoading(false);

                if (!res.fetched || !res.ok) {
                    console.error(res.fetched ? res.data : res.error);
                    setTrending([]);
                    return;
                }

                setTrending(res.data);
            })
            .catch(() => {
                setTrending([]);
                setLoading(false);
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
                    <ScrollView contentContainerStyle={{padding: 20}}>
                        <Text style={styles.sectionText}>Categories</Text>
                        <View style={styles.categories}>
                            <Pressable onPress={() => router.push(`/category/fruit`)}>
                                <View style={styles.category}>
                                    <View style={styles.categoryIcon} />
                                    <Text style={styles.categoryText}>Fruits</Text>
                                </View>
                            </Pressable>
                            <Pressable onPress={() => router.push(`/category/vegetable`)}>
                                <View style={styles.category}>
                                    <View style={styles.categoryIcon} />
                                    <Text style={styles.categoryText}>Vegetables</Text>
                                </View>
                            </Pressable>
                            <Pressable onPress={() => router.push(`/category/herb`)}>
                                <View style={styles.category}>
                                    <View style={styles.categoryIcon} />
                                    <Text style={styles.categoryText}>Herbs</Text>
                                </View>
                            </Pressable>
                            <Pressable onPress={() => router.push(`/category/dairy`)}>
                                <View style={styles.category}>
                                    <View style={styles.categoryIcon} />
                                    <Text style={styles.categoryText}>Dairy</Text>
                                </View>
                            </Pressable>
                        </View>
                        <Text style={styles.sectionText}>Trending Items</Text>
                        {trending.length === 0 ?
                            <View>
                                <Text>There are no trending items at this moment.</Text>
                            </View> :
                            <View style={styles.trendingItems}>
                                <View style={styles.trendingRow}>
                                    <TrendingItem priceId={trending[0]} isLoading={isLoading} />
                                    <TrendingItem priceId={trending[1]} isLoading={isLoading} />
                                </View>
                                <View style={styles.trendingRow}>
                                    <TrendingItem priceId={trending[2]} isLoading={isLoading} />
                                    <TrendingItem priceId={trending[3]} isLoading={isLoading} />
                                </View>
                                <View style={styles.trendingRow}>
                                    <TrendingItem priceId={trending[4]} isLoading={isLoading} />
                                    <TrendingItem priceId={trending[5]} isLoading={isLoading} />
                                </View>
                            </View>
                        }
                    </ScrollView>
                </View>
                <View style={[styles.content, {backgroundColor: '#eee', display: isSearching ? 'flex' : 'none'}]}>
                    <SearchTabs
                        searchText={searchText}
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
    sectionText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    categories: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30
    },
    category: {
        alignItems: 'center'
    },
    categoryIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ccc',
        marginBottom: 10
    },
    categoryText: {
        fontSize: 12,
        textAlign: 'center'
    },
    trendingItems: {
        width: '100%',
        alignItems: 'center'
    },
    trendingRow: {
        width: '100%',
        marginBottom: 5,
        flexDirection: 'row'
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
