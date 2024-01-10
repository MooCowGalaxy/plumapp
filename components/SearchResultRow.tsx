import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const capitalize = (name: string): string => {
    return name[0].toUpperCase() + name.slice(1);
};

export default function SearchResultRow({ name, priceId }: {
    name: string,
    priceId: number
}) {
    return (
        <View style={styles.container}>
            <Link href={`/product/${priceId}`} asChild>
                <TouchableOpacity style={styles.row}>
                    <Text style={styles.text}>{capitalize(name)}</Text>
                    <Ionicons name='arrow-forward' size={18} />
                </TouchableOpacity>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {},
    arrow: {}
});