import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import priceIds from '../assets/data/priceIds.json';
import thumbhashes from '../assets/data/thumbhashes.json';

export default function TrendingItem({ priceId, isLoading }: {
    priceId: number,
    isLoading: boolean
}) {
    const router = useRouter();
    const product = priceIds.filter(x => x.id === priceId)[0];

    return (
        <Pressable style={styles.container} onPress={() => router.push(`/product/${priceId}`)}>
            {isLoading || product === undefined ?
                <View style={styles.placeholder} />
                :
                // @ts-ignore
                <Image style={styles.image} source={`https://static.c4n.net/${product.imageName}`} placeholder={{ thumbhash: thumbhashes[product.imageName] }} contentFit='contain' transition={400} />
            }
            <Text style={styles.text}>{isLoading || product === undefined ? '' : product.name}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        margin: 5,
        borderRadius: 10,
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 10
    },
    placeholder: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 10,
        backgroundColor: '#eee'
    },
    text: {
        textTransform: 'capitalize',
        textAlign: 'center'
    }
});