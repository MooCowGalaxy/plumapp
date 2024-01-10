import { StyleSheet, FlatList, View, Text } from 'react-native';

import SearchResultRow from './SearchResultRow';
import calculateSearchScore from '../utilities/calculateSearchScore';
import priceIds from '../assets/data/priceIds.json';

export default function SearchResults({ searchMode, searchText }: {
    searchMode: string,
    searchText: string
}) {
    if (searchMode === 'name') {
        if (searchText.length < 3) {
            return (
                <View style={{flex: 1, alignItems: 'center', paddingTop: 20}}>
                    <Text style={{color: '#888'}}>Type 3 or more characters to start searching...</Text>
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
                    <SearchResultRow name={item.name} priceId={item.id} />}
                keyExtractor={item => item.id.toString()}
            />
        );
    } else {

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});