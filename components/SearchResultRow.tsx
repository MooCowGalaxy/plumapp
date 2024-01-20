import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';

export default function SearchResultRow({ name, link, imageUrl = '' }: {
    name: string,
    link: any,
    imageUrl?: string
}) {
    return (
        <View>
            <Link href={link} asChild>
                <TouchableOpacity style={styles.row}>
                    {imageUrl.length > 0 ?
                        <Image style={styles.image} source={imageUrl} contentFit='contain' transition={400} />
                    : <></>}
                    <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
                    <Ionicons name='arrow-forward' size={18} />
                </TouchableOpacity>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        margin: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        height: 32,
        width: 32,
        marginRight: 10
    },
    text: {
        textTransform: 'capitalize',
        flex: 1
    }
});