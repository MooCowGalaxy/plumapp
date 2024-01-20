import { FlatList } from 'react-native';
import { View } from '../../components/Themed';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import priceIds from '../../assets/data/priceIds.json';
import SearchResultRow from '../../components/SearchResultRow';

export default function CategoryListScreen() {
    const local = useLocalSearchParams();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            title: local.id[0].toUpperCase() + `${local.id.slice(1)}s`
        });
    },[]);

    return (
        <View style={{flex: 1}}>
            <FlatList
                data={priceIds.filter(x => x.category === local.id)}
                renderItem={({item}) => <SearchResultRow name={item.name} link={`/product/${item.id}`} imageUrl={item.imageName ? `https://static.c4n.net/icons/${item.imageName}` : ''} />}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}