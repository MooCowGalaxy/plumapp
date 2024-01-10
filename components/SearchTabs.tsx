import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import SearchResults from "./SearchResults";

export default function SearchTabs(props: {
    searchText: string,
    setSearchText: React.Dispatch<React.SetStateAction<string>>,
    searchMode: string,
    setSearchMode: React.Dispatch<React.SetStateAction<string>>
}) {
    const {
        searchText, setSearchText,
        searchMode, setSearchMode
    } = props;

    return (
        <View style={styles.container}>
            <View style={styles.tabs}>
                <Pressable onPress={() => {
                    setSearchMode('name');
                }} style={[styles.tab, searchMode === 'name' ? styles.tabSelected : styles.tabUnselected]}>
                    <Text style={[styles.tabName, searchMode === 'name' ? styles.tabNameSelected : styles.tabNameUnselected]}>Search by Name</Text>
                </Pressable>
                <Pressable onPress={() => {
                    setSearchMode('plu');
                }} style={[styles.tab, searchMode === 'plu' ? styles.tabSelected : styles.tabUnselected]}>
                    <Text style={[styles.tabName, searchMode === 'plu' ? styles.tabNameSelected : styles.tabNameUnselected]}>Search by PLU Code</Text>
                </Pressable>
            </View>
            <View style={styles.content}>
                <SearchResults searchMode={searchMode} searchText={searchText} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaeceb'
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        justifyContent: 'center'
    },
    tab: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'solid',
        borderBottomWidth: 2
    },
    tabSelected: {
        borderColor: '#000'
    },
    tabUnselected: {
        borderColor: '#fff'
    },
    tabName: {
        fontSize: 16,
    },
    tabNameSelected: {
        color: '#000'
    },
    tabNameUnselected: {
        color: '#aaa'
    },
    content: {
        flex: 1,
        backgroundColor: '#eaeceb'
    },
    contentTab: {

    },
});