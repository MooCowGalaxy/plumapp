import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';
import { STATIC_URL } from '../../constants/vars';

export default function FeedbackSent() {
    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.image}>
                <Image source={`${STATIC_URL}/bananas.png`} placeholder={{thumbhash: '6juCBQA1aLhXt3OK+0ByQgIjKWaGeHCahg=='}} placeholderContentFit="none" contentFit="cover" cachePolicy="disk" style={{height: 200, width: 200}} transition={400} />
            </View>
            <Text style={styles.header}>Thank you for your feedback!</Text>
            <Text style={styles.text}>We really appreciate your time in helping us improve the experience for everyone.</Text>
            <Text style={{ ...styles.text, marginBottom: 36 }}>Here's a banana for your efforts.</Text>
            <View style={styles.button}>
                <Pressable onPress={() => router.navigate('/')}>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>Back to Home</Text>
                    </View>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: 36
    },
    image: {
        marginVertical: 24
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center'
    },
    text: {
        fontSize: 16,
        marginBottom: 12,
        textAlign: 'center'
    },
    button: {
        alignItems: 'center'
    },
    buttonContainer: {
        backgroundColor: Colors.light.tint,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    }
});