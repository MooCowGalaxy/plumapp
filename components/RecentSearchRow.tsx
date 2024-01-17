import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import priceIds from '../assets/data/priceIds.json';
import { removeRecentSearch } from '../utilities/storage';
import React from 'react';

export default function RecentSearchRow({ priceId, setUpdateRecent }: {
    priceId: number,
    setUpdateRecent: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const deleteRecent = () => {
        removeRecentSearch(priceId)
            .then(() => setUpdateRecent(prev => !prev));
    };

    const filter = priceIds.filter(x => x.id === priceId);

    if (filter.length === 0) {
        return (
            <View>
                <Link href={`/product/${priceId}`} asChild>
                    <View style={styles.row}>
                        <Text style={styles.text}>N/A</Text>
                        <TouchableOpacity onPress={deleteRecent}>
                            <Ionicons name='close' size={18} color='#999' />
                        </TouchableOpacity>
                    </View>
                </Link>
            </View>
        );
    }

    const selected = filter[0];

    return (
        <View style={styles.container}>
            <Link href={`/product/${priceId}`} asChild>
                <TouchableOpacity style={{flex: 1, paddingVertical: 15}}>
                    <Text style={styles.text}>{selected.name}</Text>
                </TouchableOpacity>
            </Link>
            <TouchableOpacity onPress={deleteRecent} style={{paddingVertical: 15}}>
                <Ionicons name='close' size={18} color='#999' />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center'
    },
    row: {
        margin: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        textTransform: 'capitalize'
    },
    arrow: {}
});