import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { useState } from 'react';
import { Text } from './Themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';

export default function SearchProductsBar() {
    const [focused, setFocused] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search fruit, vegetables, etc."
                    selectionColor={Colors.accent.background}
                    onFocus={() => setFocused(true)}
                    onEndEditing={() => setFocused(false)}
                />
            </View>
            <TouchableOpacity
                style={[styles.cancelContainer, {display: focused ? 'flex' : 'none'}]}
                onPress={() => {
                    setFocused(false);
                    Keyboard.dismiss();
                }}
            >
                <Text style={styles.cancelButton}>cancel</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 20,
        flexDirection: 'row'
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 10,
        borderStyle: 'solid',
        borderColor: Colors.accent.tint,
        borderWidth: 1,
        padding: 10
    },
    searchIcon: {
        color: 'rgba(0, 0, 0, 0.35)',
        marginRight: 5,
    },
    searchInput: {
        flex: 1,
    },
    cancelContainer: {
        paddingLeft: 10,
        justifyContent: 'center'
    },
    cancelButton: {
        color: 'rgba(0, 0, 0, 0.35)'
    }
});