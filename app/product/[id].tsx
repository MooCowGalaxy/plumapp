import { StyleSheet, ScrollView, SafeAreaView, Pressable, View, Image, TextInput, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useState, useEffect } from 'react';
import { Text } from '../../components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import priceIds from '../../assets/data/priceIds.json';
import Colors from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import fetchApi from '../../utilities/fetch';
import { Dropdown } from 'react-native-element-dropdown';

const setFloat = (value: string, setter: any): void => {
    if (value.length === 0) {
        setter(value);
        return;
    } else if (value === '.') {
        setter('0.');
        return;
    } else if (value === '0') {
        setter('0');
        return;
    }

    let parsed = parseFloat(value);

    if (isNaN(parsed)) return;

    if (value.split('').reduce((prev, cur) => prev += cur === '.' ? 1 : 0, 0) > 1) return;
    if (value.split('.').length > 1 && value.split('.')[1].length > 2) return;

    if (value.endsWith('.')) {
        setter(value);
        return;
    }

    setter(value.split('').reduce((prev, cur) => {
        if (prev.length === 0 && cur === '0') return prev;
        else return prev + cur;
    }, ''));
}

export default function ProductInfoScreen() {
    const localParams = useLocalSearchParams();
    const [priceId, setPriceId] = useState<any>(undefined);

    const [isLoading, setIsLoading] = useState(true);
    const [isFetchError, setIsFetchError] = useState(false);
    const [units, setUnits] = useState<string[]>([]);

    const [isOrganic, setIsOrganic] = useState(false);
    const [priceInput, setPriceInput] = useState('');
    const [selectedUnit, setSelectedUnit] = useState<string>();

    const [isFetching, setIsFetching] = useState(false);
    const [result, setResult] = useState<{
        average: number,
        date: number,
        season: string,
        fetched: boolean
    }>({average: 0, date: 0, season: '', fetched: false});

    useEffect(() => {
        let p = priceIds.filter(item => item.id.toString() === localParams.id);

        if (p.length === 0) setPriceId(null);
        else setPriceId(p[0]);

        fetchApi('/lookup/units', 'POST', {
            priceId: p[0].id
        }).then(res => {
            setIsLoading(false);

            if (!res.fetched || !res.ok) {
                console.error(res.fetched ? res.data : res.error);
                setIsFetchError(true);
                return;
            }

            setIsFetchError(false);
            setUnits(res.data);
        })
    }, [localParams]);

    let isFormValid = true;
    if (selectedUnit === undefined || priceInput.length === 0) isFormValid = false;

    const onEvaluate = () => {
        if (!isFormValid) return;
        const body = {
            priceId: priceId.id,
            unit: selectedUnit,
            region: 'southwest', // TODO: add support for changing regions
            organic: isOrganic,
            price: parseFloat(priceInput)
        };

        setIsFetching(true);

        fetchApi('/lookup/price', 'POST', body)
            .then(res => {
                setIsFetching(false);

                if (!res.fetched || !res.ok) {
                    console.error(res.fetched ? res.data : res.error);
                    return;
                }

                setResult({
                    average: res.data.price,
                    date: res.data.date,
                    season: res.data.season,
                    fetched: true
                });
            })
    };

    // loading screen
    if (priceId === undefined || isLoading) {
        return (
            <SafeAreaView style={loadingStyles.container}>
                <View style={loadingStyles.header}>
                    <Pressable onPress={() => router.back()}>
                        <Ionicons name="arrow-back-outline" size={28} />
                    </Pressable>
                </View>
                <View style={loadingStyles.contentContainer}>
                    <ActivityIndicator />
                </View>
            </SafeAreaView>
        );
    }

    // not found screen
    if (priceId === null) {
        return (
            <SafeAreaView style={[notFoundStyles.container, styles.container]}>
                <Text style={notFoundStyles.header}>Sorry!</Text>
                <Text style={notFoundStyles.text}>We don't have pricing information on this product at this time.</Text>
                <Pressable onPress={() => router.back()}>
                    <View style={notFoundStyles.button}>
                        <Text style={notFoundStyles.buttonText}>Go back</Text>
                    </View>
                </Pressable>
            </SafeAreaView>
        );
    }

    // error screen
    if (isFetchError) {
        return (
            <SafeAreaView style={[notFoundStyles.container, styles.container]}>
                <Text style={notFoundStyles.header}>Uh oh!</Text>
                <Text style={notFoundStyles.text}>Something went wrong while loading pricing information for this product. Please try again later.</Text>
                <Pressable onPress={() => router.back()}>
                    <View style={notFoundStyles.button}>
                        <Text style={notFoundStyles.buttonText}>Go back</Text>
                    </View>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView automaticallyAdjustKeyboardInsets={true} scrollEnabled={false} style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
                <SafeAreaView style={{backgroundColor: '#eaeceb'}}>
                    <View style={styles.headerButtons}>
                        <Pressable onPress={() => router.back()}>
                            <Ionicons name="arrow-back-outline" size={28} />
                        </Pressable>
                        <Pressable>
                            <Ionicons name="help-circle-outline" size={28} />
                        </Pressable>
                    </View>
                </SafeAreaView>
                <View style={styles.productImageContainer}>
                    {priceId.imageName ? <Image source={require(`../../assets/images/test.png`)} resizeMode="contain" style={{height: 240}} /> : <View style={{height: 240, justifyContent: 'center', alignItems: 'center'}}><Text>No image</Text></View>}
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.categoryText}>{priceId.category}</Text>
                    <Text style={styles.productText}>{priceId.name}</Text>
                    <View style={{display: result.fetched ? 'none' : 'flex'}}>
                        <BouncyCheckbox
                            size={24}
                            style={{ marginBottom: 20 }}
                            fillColor={Colors.accent.tint}
                            unfillColor='rgba(0, 0, 0, 0)'
                            text='Organic?'
                            textStyle={{
                                color: 'black',
                                textDecorationLine: 'none',
                                marginLeft: -8
                            }}
                            iconStyle={{ borderRadius: 5, borderColor: '#aaa' }}
                            innerIconStyle={{ borderRadius: 5 }}
                            onPress={setIsOrganic}
                        />
                        <View style={styles.inputContainer}>
                            <Text style={styles.dollarSign}>$</Text>
                            <TextInput
                                style={styles.priceInput}
                                placeholder="0.00"
                                selectionColor={Colors.accent.background}
                                value={priceInput}
                                onChangeText={value => setFloat(value, setPriceInput)}
                                inputMode="decimal"
                            />
                            <Text style={[styles.dollarSign, {marginRight: 5}]}>/</Text>
                            <Dropdown
                                style={styles.unitInput}
                                selectedTextStyle={{fontSize: 20}}
                                data={units.map(unit => ({label: unit.startsWith('per') ? unit.split(' ').slice(1).join(' ') : unit, value: unit}))}
                                labelField="label"
                                valueField="value"
                                value={selectedUnit}
                                onChange={item => setSelectedUnit(item.value)}
                                placeholder="select unit"
                                placeholderStyle={styles.unitSelectText}
                            />
                        </View>
                        <Pressable onPress={onEvaluate}>
                            <View style={[notFoundStyles.button, isFormValid ? {} : styles.invalidFormButton]}>
                                {!isFetching ?
                                    <Text style={[notFoundStyles.buttonText, {textAlign: 'center'}, isFormValid ? {} : styles.invalidFormText]}>Evaluate</Text> :
                                    <ActivityIndicator color='#fff' />
                                }
                            </View>
                        </Pressable>
                    </View>
                    <View style={{display: result.fetched ? 'flex' : 'none'}}>
                        <Text style={{fontSize: 24}}>{isOrganic ? 'Organic' : ''}</Text>
                        <View style={styles.resultPriceContainer}>
                            <View style={{justifyContent: 'center'}}>
                                <Text style={styles.priceLabel}>Average price</Text>
                                <Text style={styles.priceLastUpdated}>Last updated: {new Date(result.date * 1000).toLocaleDateString()}</Text>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                <Text style={styles.priceData}>${result.average} / {selectedUnit?.startsWith('per') ? selectedUnit.split(' ').slice(1).join(' ') : selectedUnit}</Text>
                            </View>
                        </View>
                        <Text style={styles.seasonText}>🗓️ {result.season}</Text>
                    </View>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

const loadingStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaeceb',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const notFoundStyles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 18,
        padding: 20,
        textAlign: 'center'
    },
    button: {
        backgroundColor: Colors.accent.tint,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 18
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold'
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaeceb'
    },
    headerButtons: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerButton: {

    },
    productImageContainer: {
        alignItems: 'center',
        backgroundColor: '#eaeceb',
        width: '100%'
    },
    priceContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        padding: 30
    },
    categoryText: {
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase',
        color: '#aaa'
    },
    productText: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 28,
        textTransform: 'capitalize',
        marginBottom: 5
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20
    },
    dollarSign: {
        fontSize: 22,
        color: 'black',
        marginRight: 2
    },
    priceInput: {
        flex: 1,
        fontSize: 20
    },
    unitInput: {
        flex: 1
    },
    unitSelectText: {
        fontSize: 20
    },
    invalidFormButton: {
        backgroundColor: '#eee'
    },
    invalidFormText: {
        color: '#999'
    },
    resultPriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    priceLabel: {
        fontSize: 20
    },
    priceData: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    priceLastUpdated: {
        fontSize: 14,
        color: '#aaa'
    },
    seasonText: {
        fontSize: 20
    }
});