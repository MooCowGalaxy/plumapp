import { StyleSheet, SafeAreaView, Pressable, View } from 'react-native';
import { Text } from '../../components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import priceIds from '../../assets/data/priceIds.json';
import Colors from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ProductInfoScreen() {
    const local = useLocalSearchParams();

    let priceId = priceIds.filter(item => item.id.toString() === local.id);
    if (priceId.length === 0) {
        return (
            <SafeAreaView style={[styles.notFound, styles.container]}>
                <Text style={styles.header}>Sorry!</Text>
                <Text style={styles.notFoundText}>We don't have pricing information on this product at this time.</Text>
                <Pressable onPress={() => router.back()}>
                    <View style={styles.notFoundButton}>
                        <Text style={styles.notFoundButtonText}>Go back</Text>
                    </View>
                </Pressable>
            </SafeAreaView>
        )
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={styles.headerButtons}>
                    <Pressable onPress={() => router.back()}>
                        <Ionicons name="arrow-back-outline" size={28} />
                    </Pressable>
                    <Pressable>
                        <Ionicons name="help-circle-outline" size={28} />
                    </Pressable>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    notFound: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    notFoundText: {
        fontSize: 18,
        padding: 20
    },
    notFoundButton: {
        backgroundColor: Colors.accent.tint,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    notFoundButtonText: {
        color: '#fff',
        fontSize: 18
    },
    container: {
        flex: 1,
        backgroundColor: '#eaeceb'
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    headerButtons: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerButton: {

    }
});