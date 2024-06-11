import { SafeAreaView, View, StyleSheet, Pressable } from 'react-native';
import Colors from '../../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '../../../components/Themed';
import { useRouter } from 'expo-router';

export default function Legal() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingVertical: 18 }}>
                <Pressable onPress={() => router.push(`/more/legal/tos`)}>
                    <View style={styles.menuRow}>
                        <Ionicons name="document-text-outline" size={24} color="black" />
                        <Text style={styles.menuText}>Terms and Conditions</Text>
                    </View>
                </Pressable>
                <View style={styles.separator} />
                <Pressable onPress={() => router.push(`/more/legal/privacy`)}>
                    <View style={styles.menuRow}>
                        <Ionicons name="document-lock-outline" size={24} color="black" />
                        <Text style={styles.menuText}>Privacy Policy</Text>
                    </View>
                </Pressable>
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
    menuRow: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    menuText: {
        fontSize: 20,
        color: Colors.light.text
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: '#ddd'
    },
});