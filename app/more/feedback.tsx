import { StyleSheet, ScrollView, View, Text, Pressable, TextInput } from 'react-native';
import Toast from 'react-native-root-toast';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import fetchApi from '../../utilities/fetch';
import { useRouter } from 'expo-router';

function Star({ stars, starNum, onClick }: { stars: number, starNum: number, onClick: (star: number) => void }) {
    return (
        <Pressable onPress={() => onClick(starNum)}>
            <Ionicons name={stars >= starNum ? 'star' : 'star-outline'} size={32} color={stars >= starNum ? 'gold' : 'gray'} />
        </Pressable>
    );
}

export default function Feedback() {
    const router = useRouter();
    const [stars, setStars] = useState(0);
    const [input, setInput] = useState('');
    const [disabled, setDisabled] = useState(false);

    const onStarClick = (star: number) => {
        setStars(star);
    };

    const onSubmit = async () => {
        if (stars === 0) {
            Toast.show('Please choose a rating!', {
                duration: Toast.durations.LONG
            });
            return;
        } else if (input.length === 0) {
            Toast.show('Please enter some feedback!', {
                duration: Toast.durations.LONG
            });
            return;
        } else if (input.length > 2000) {
            Toast.show('Feedback is too long.', {
                duration: Toast.durations.LONG
            });
            return;
        }

        const body = {
            rating: stars,
            feedback: input
        };

        setDisabled(true);

        const res = await fetchApi('/feedback', 'POST', body);

        setDisabled(false);

        if (!res.fetched || !res.ok) {
            Toast.show('Something went wrong, please try again later.', {
                duration: Toast.durations.LONG
            });
            return;
        }

        router.replace('/more/feedbackSent');
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Give us Feedback!</Text>
            <Text style={styles.text}>We want to make this app as useful to you as possible! Tell us what you like, what you didn't like. Any suggestions?</Text>
            <Text style={styles.starLabel}>Your overall rating:</Text>
            <View style={styles.starContainer}>
                <Star stars={stars} starNum={1} onClick={!disabled ? onStarClick : () => {}} />
                <Star stars={stars} starNum={2} onClick={!disabled ? onStarClick : () => {}} />
                <Star stars={stars} starNum={3} onClick={!disabled ? onStarClick : () => {}} />
                <Star stars={stars} starNum={4} onClick={!disabled ? onStarClick : () => {}} />
                <Star stars={stars} starNum={5} onClick={!disabled ? onStarClick : () => {}} />
            </View>
            <TextInput
                style={styles.input}
                placeholder="Type your thoughts here. Be brutally honest, we can take it! (max 2000 characters)"
                selectionColor={Colors.accent.background}
                onFocus={() => {}}
                value={input}
                onChangeText={setInput}
                inputMode="text"
                multiline={true}
                maxLength={2000}
                editable={!disabled}
            />
                <View style={styles.submit}>
                    <Pressable onPress={onSubmit}>
                        <View style={{ ...styles.submitContainer, backgroundColor: !disabled ? Colors.light.tint : 'gray' }}>
                            <Text style={styles.submitText}>{!disabled ? 'Submit' : 'Submitting...'}</Text>
                        </View>
                    </Pressable>
                </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 12
    },
    text: {
        fontSize: 16,
        marginBottom: 24
    },
    starLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8
    },
    starContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12
    },
    input: {
        padding: 8,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 8,
        borderStyle: 'solid',
        marginBottom: 24
    },
    submit: {
        alignItems: 'center'
    },
    submitContainer: {
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12
    },
    submitText: {
        color: 'white',
        fontSize: 16
    }
});