import { FlatList, View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import SearchResultRow from './SearchResultRow';
import calculateSearchScore from '../utilities/calculateSearchScore';
import priceIds from '../assets/data/priceIds.json';
import { getRecentSearches } from '../utilities/storage';
import RecentSearchRow from "./RecentSearchRow";

export default function SearchResults({ searchMode, searchText }: {
    searchMode: string,
    searchText: string
}) {
    const [recent, setRecent] = useState<number[]>([]);
    const [updateRecent, setUpdateRecent] = useState(false);

    const update = () => {
        getRecentSearches()
            .then(res => {
                setRecent(res);
            });
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            update();
        }, 1000);

        return () => clearInterval(intervalId);
    })
    useEffect(() => {
        update();
    }, [updateRecent]);

    if (searchMode === 'name') {
        if (searchText.length < 3) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <Text style={{color: '#888', textAlign: 'center', marginBottom: 20}}>Type 3 or more characters to start searching...</Text>
                    <View style={{display: recent.length > 0 ? 'flex' : 'none'}}>
                        <Text style={{color: 'black', fontWeight: 'bold', marginLeft: 15, fontSize: 20}}>Recent Searches</Text>
                        <View style={{height: 1, marginTop: 1, marginHorizontal: 15, backgroundColor: '#d2d2d2'}} />
                        <FlatList
                            data={recent}
                            renderItem={({item}) =>
                                <RecentSearchRow priceId={item} setUpdateRecent={setUpdateRecent} />}
                            keyExtractor={item => item.toString()}
                        />
                    </View>
                </View>
            );
        }

        const lowercased = searchText.toLowerCase();
        const scoreCache: { [id: number]: number } = {};

        for (const priceId of priceIds) {
            scoreCache[priceId.id] = calculateSearchScore(lowercased, priceId);
        }

        const results = priceIds.sort((a, b) => {
            return scoreCache[b.id] - scoreCache[a.id];
        }).filter(item => scoreCache[item.id] >= 0.5).slice(0, 20);

        return (
            <FlatList
                data={results}
                renderItem={({item}) =>
                    <SearchResultRow name={item.name} priceId={item.id} setUpdateRecent={setUpdateRecent} />}
                keyExtractor={item => item.id.toString()}
            />
        );
    } else {

    }
}