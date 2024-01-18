import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard, Pressable } from 'react-native';
import React, { useRef, useEffect } from 'react';
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
    const inputRef = useRef<any>();

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
            <View style={[styles.searchBar, { borderColor: isSearching ? Colors.accent.tint : '#e2e2e2' }]}>
                <Pressable style={{marginRight: 5}} onPress={() => inputRef.current?.focus()}>
                    <Ionicons name="search" size={20} style={styles.searchIcon} />
                </Pressable>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search fruits, vegetables, etc."
                    selectionColor={Colors.accent.background}
                    onFocus={() => setIsSearching(true)}
                    value={searchText}
                    onChangeText={setSearchText}
                    ref={inputRef}
                    /*onEndEditing={() => setIsSearching(false)}*/
                    inputMode={searchMode === 'name' ? 'text' : 'numeric'}
                />
                <Pressable style={{alignItems: 'center', justifyContent: 'center', display: searchText.length === 0 ? 'none' : 'flex'}} onPress={() => setSearchText('')}>
                    <Ionicons name="close" size={20} style={styles.clearIcon} />
                </Pressable>
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
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row'
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        paddingHorizontal: 10
    },
    searchIcon: {
        color: 'rgba(0, 0, 0, 0.35)'
    },
    clearIcon: {
        color: 'rgba(0, 0, 0, 0.2)',
        marginRight: -5,
        paddingHorizontal: 5,
        paddingVertical: 9
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12
    },
    cancelContainer: {
        paddingLeft: 10,
        paddingVertical: 10,
        justifyContent: 'center'
    },
    cancelButton: {
        color: 'rgba(0, 0, 0, 0.35)'
    }
});