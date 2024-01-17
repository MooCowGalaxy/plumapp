import React, { useRef } from 'react';
import { Animated, View, StyleSheet, Pressable, Dimensions, Easing } from 'react-native';
import SearchResults from './SearchResults';

export default function SearchTabs(props: {
    searchText: string,
    searchMode: string,
    setSearchMode: React.Dispatch<React.SetStateAction<string>>
}) {
    const {
        searchText,
        searchMode, setSearchMode
    } = props;

    const transitionState = useRef(new Animated.Value(0)).current;
    const windowWidth = Dimensions.get('window').width;

    const onPress = (tab: string) => {
        setSearchMode(tab);

        Animated.timing(transitionState, {
            toValue: tab === 'name' ? 0 : 1,
            easing: Easing.bezier(0.4, 0, 0.5,1),
            duration: 150,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabs}>
                <Pressable onPress={() => onPress('name')} style={[styles.tab, searchMode === 'name' ? styles.tabSelected : styles.tabUnselected]}>
                    <Animated.Text style={[styles.tabName, {opacity: transitionState.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.4]
                        })}]}>Search by Name</Animated.Text>
                </Pressable>
                <Pressable onPress={() =>onPress('plu')} style={[styles.tab, searchMode === 'plu' ? styles.tabSelected : styles.tabUnselected]}>
                    <Animated.Text style={[styles.tabName, {opacity: transitionState.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.4, 1]
                        })}]}>Search by PLU Code</Animated.Text>
                </Pressable>
                <Animated.View style={{position: 'absolute', left: 0, bottom: 0, width: '50%', height: 2, backgroundColor: '#000', transform: [{translateX:
                            transitionState.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, windowWidth / 2]
                            })}]
                }} />
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
        //borderBottomLeftRadius: 18,
        //borderBottomRightRadius: 18,
        justifyContent: 'center',
        position: 'relative'
    },
    tab: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        //borderStyle: 'solid',
        //borderBottomWidth: 2
    },
    tabSelected: {
        //borderColor: '#000'
    },
    tabUnselected: {
        //borderColor: '#fff'
    },
    tabName: {
        fontSize: 16,
        color: '#000'
    },
    content: {
        flex: 1,
        backgroundColor: '#eaeceb'
    },
    contentTab: {

    },
});