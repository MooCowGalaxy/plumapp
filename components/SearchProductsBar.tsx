import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import React, { useEffect } from 'react';
import { Text } from './Themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';

export default function SearchProductsBar(props: {
    isSearching: boolean,
    setIsSearching: React.Dispatch<React.SetStateAction<boolean>>,
    searchText: string,
    setSearchText: React.Dispatch<React.SetStateAction<string>>,
    searchMode: string,
    setSearchMode: React.Dispatch<React.SetStateAction<string>>
}) {
    const {
        isSearching, setIsSearching,
        searchText, setSearchText,
        searchMode, setSearchMode
    } = props;

    useEffect(() => {
        if (!isSearching) {
            Keyboard.dismiss();
        } else {
            setSearchMode('name');
        }
    }, [isSearching]);

    useEffect(() => {
        setSearchText('');
    }, [isSearching, searchMode]);

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search fruit, vegetables, etc."
                    selectionColor={Colors.accent.background}
                    onFocus={() => setIsSearching(true)}
                    value={searchText}
                    onChangeText={setSearchText}
                    /*onEndEditing={() => setIsSearching(false)}*/
                    inputMode={searchMode === 'name' ? 'text' : 'numeric'}
                />
            </View>
            <TouchableOpacity
                style={[styles.cancelContainer, {display: isSearching ? 'flex' : 'none'}]}
                onPress={() => {
                    setIsSearching(false);
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