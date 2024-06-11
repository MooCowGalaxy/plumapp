import { SafeAreaView, Pressable, StyleSheet } from 'react-native';
import * as MailComposer from 'expo-mail-composer';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
    const router = useRouter();

    const onContactPress = () => {
        if (process.env.EXPO_PUBLIC_SUPPORT_EMAIL) MailComposer.composeAsync({
            recipients: [process.env.EXPO_PUBLIC_SUPPORT_EMAIL]
        }).then().catch();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingVertical: 18 }}>
                <Text style={styles.title}>More</Text>
                <Pressable onPress={() => router.push(`/more/legal`)}>
                    <View style={styles.menuRow}>
                        <Ionicons name="document-text-outline" size={24} color="black" />
                        <Text style={styles.menuText}>Legal</Text>
                    </View>
                </Pressable>
                <View style={styles.separator} lightColor="#ddd" darkColor="rgba(255,255,255,0.5)" />
                <Pressable onPress={() => router.push(`/more/help`)}>
                    <View style={styles.menuRow}>
                        <Ionicons name="help-outline" size={24} color="black" />
                        <Text style={styles.menuText}>Help/FAQs</Text>
                    </View>
                </Pressable>
                <View style={styles.separator} lightColor="#ddd" darkColor="rgba(255,255,255,0.5)" />
                <Pressable onPress={onContactPress}>
                    <View style={styles.menuRow}>
                        <Ionicons name="call-outline" size={24} color="black" />
                        <Text style={styles.menuText}>Contact Us</Text>
                    </View>
                </Pressable>
                <View style={styles.separator} lightColor="#ddd" darkColor="rgba(255,255,255,0.5)" />
                <Pressable onPress={() => router.push(`/more/feedback`)}>
                    <View style={styles.menuRow}>
                        <Ionicons name="chatbubbles-outline" size={24} color="black" />
                        <Text style={styles.menuText}>Feedback</Text>
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
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        paddingHorizontal: 24,
        paddingBottom: 12
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
    },
});
