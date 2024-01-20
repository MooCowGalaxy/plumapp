import { StyleSheet, SafeAreaView, Pressable, View, TextInput, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Image } from 'expo-image';
import { useState, useEffect } from 'react';
import { Text } from '../../components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import priceIds from '../../assets/data/priceIds.json';
import thumbhashes from '../../assets/data/thumbhashes.json';
import Colors from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import fetchApi from '../../utilities/fetch';
import { Dropdown } from 'react-native-element-dropdown';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { addRecentSearch } from '../../utilities/storage';

const clamp = (min: number, value: number, max: number): number => {
    if (min > value) return min;
    else if (max < value) return max;
    else return value;
};

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

    let zeroCount = 0;
    for (const char of value) {
        if (char !== '0') break;
        zeroCount++;
    }

    if (zeroCount > 1) return;

    let parsed = parseFloat(value);

    if (isNaN(parsed)) return;

    if (value.split('').filter(x => x === '.').length > 1) return;

    if (value.split('').reduce((prev, cur) => prev + cur === '.' ? 1 : 0, 0) > 1) return;
    if (value.split('.').length > 1 && value.split('.')[1].length > 2) return;

    if (value.endsWith('.')) {
        setter(value);
        return;
    }

    /*setter(value.split('').reduce((prev, cur) => {
        if (prev.length === 0 && cur === '0') return prev;
        else return prev + cur;
    }, ''));*/
    setter(value);
    //setter(parsed.toString());
}

const IMAGE_DIM = 280;
const NO_IMAGE_DIM = 200;

export default function ProductInfoScreen() {
    const localParams = useLocalSearchParams();
    const [priceId, setPriceId] = useState<any>(undefined);

    const [isLoading, setIsLoading] = useState(true);
    const [isFetchError, setIsFetchError] = useState(false);
    const [units, setUnits] = useState<string[]>([]);

    const [isOrganic, setIsOrganic] = useState(localParams.organic === 'true');
    const [priceInput, setPriceInput] = useState('');
    const [selectedUnit, setSelectedUnit] = useState<string>();

    const [isFetching, setIsFetching] = useState(false);
    const [result, setResult] = useState<{
        average: number,
        date: number,
        season: string,
        fetched: boolean
    }>({average: 0, date: 0, season: '', fetched: false});

    const isImageHidden = useSharedValue(false);
    const isGesture = useSharedValue(false);
    const initialOffset = useSharedValue(0);
    const transformOffset = useSharedValue(0);
    const transformStyles = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: transformOffset.value }
            ]
        };
    });

    const offsetMax = priceId?.imageName === null ? NO_IMAGE_DIM : IMAGE_DIM;
    const pan = Gesture.Pan()
        .runOnJS(true)
        .onStart(() => {
            isGesture.value = true;
            initialOffset.value = transformOffset.value;
        })
        .onUpdate(e => {
            transformOffset.value = clamp(-offsetMax, e.translationY + initialOffset.value, 0);
            //transformOffset.value = (isImageHidden.value ? -offsetMax : 0) + clamp(isImageHidden.value ? 0 : -offsetMax, e.translationY, isImageHidden.value ? offsetMax : 0);
        })
        .onFinalize(() => {
            isGesture.value = false;
            transformImage(transformOffset.value < -offsetMax / 2);
        });

    const swipeLeft = Gesture.Pan()
        .runOnJS(true)
        .activeOffsetX(80)
        .hitSlop({
            left: 0,
            width: 20
        })
        .onStart(() => {
            router.back();
        });

    const composed = Gesture.Simultaneous(pan, swipeLeft);

    const transformImage = (isHidden: boolean) => {
        isImageHidden.value = isHidden;
        transformOffset.value = withSpring(isHidden ? -offsetMax : 0, {
            duration: 800,
            dampingRatio: 1,
            stiffness: 100,
            overshootClamping: false,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 2,
        });
    }

    useEffect(() => {
        let p = priceIds.filter(item => item.id.toString() === localParams.id);

        if (p.length === 0) {
            setPriceId(null);
            setIsLoading(false);
            return;
        }
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

            addRecentSearch(p[0].id).then();
        });
    }, [localParams]);

    let isFormValid = true;
    if (selectedUnit === undefined || priceInput.length === 0) isFormValid = false;

    const onEvaluate = () => {
        if (!isFormValid || isFetching) return;

        const body = {
            priceId: priceId.id,
            unit: selectedUnit,
            region: 'southwest', // TODO: add support for changing regions
            organic: isOrganic,
            price: parseFloat(priceInput)
        };

        setIsFetching(true);

        Keyboard.dismiss();

        fetchApi('/lookup/price', 'POST', body)
            .then(res => {
                setIsFetching(false);

                if (!res.fetched || !res.ok || res.data === undefined) {
                    console.error(res.fetched ? res.data : res.error);
                    return;
                }

                setResult({
                    average: res.data.price,
                    date: res.data.date,
                    season: res.data.season,
                    fetched: true
                });
            });
    };

    // loading screen
    if (priceId === undefined || isLoading) {
        return (
            <GestureDetector gesture={swipeLeft}>
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
            </GestureDetector>
        );
    }

    // not found screen
    if (priceId === null) {
        return (
            <GestureDetector gesture={swipeLeft}>
                <SafeAreaView style={loadingStyles.container}>
                    <View style={loadingStyles.header}>
                        <Pressable onPress={() => router.back()}>
                            <Ionicons name="arrow-back-outline" size={28} />
                        </Pressable>
                    </View>
                    <View style={loadingStyles.contentContainer}>
                        <Text style={notFoundStyles.header}>Sorry!</Text>
                        <Text style={notFoundStyles.text}>We don't have pricing information on this product at this time.</Text>
                        <Pressable onPress={() => router.back()}>
                            <View style={notFoundStyles.button}>
                                <Text style={notFoundStyles.buttonText}>Go back</Text>
                            </View>
                        </Pressable>
                    </View>
                </SafeAreaView>
            </GestureDetector>
        );
    }

    // error screen
    if (isFetchError) {
        return (
            <GestureDetector gesture={swipeLeft}>
                <SafeAreaView style={[notFoundStyles.container, styles.container]}>
                    <Text style={notFoundStyles.header}>Uh oh!</Text>
                    <Text style={notFoundStyles.text}>Something went wrong while loading pricing information for this product. Please try again later.</Text>
                    <Pressable onPress={() => router.back()}>
                        <View style={notFoundStyles.button}>
                            <Text style={notFoundStyles.buttonText}>Go back</Text>
                        </View>
                    </Pressable>
                </SafeAreaView>
            </GestureDetector>
        );
    }

    const evaluationText = parseFloat(priceInput) < 0.9 * result.average ?
        <Text style={styles.seasonText}>😁🥹🤓😚😏 Score!!! This is a great price for your area. Stock up! </Text> :
        parseFloat(priceInput) > 1.1 * result.average ?
            <Text style={styles.seasonText}>🤔 There could be better prices for this product in your area.</Text> :
            <Text style={styles.seasonText}>🙂 This is a fair price for your area.</Text>;

    let percentColor = '#000';
    let percentDifference = '0';
    if (result.fetched) {
        if (result.average < parseFloat(priceInput)) {
            percentColor = '#f22';
            percentDifference = `+${Math.round(100 * (parseFloat(priceInput) / result.average - 1))}`;
        } else {
            percentColor = '#0d0';
            percentDifference = `-${Math.round(100 * (1 - parseFloat(priceInput) / result.average))}`;
        }
    }

    return (
        <GestureDetector gesture={swipeLeft}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <SafeAreaView style={{backgroundColor: '#eaeceb'}}>
                        <View style={styles.headerButtons}>
                            <Pressable style={styles.headerButton} onPress={() => router.back()}>
                                <Ionicons name="arrow-back-outline" size={28} />
                            </Pressable>
                            <Pressable style={styles.headerButton}>
                                <Ionicons name="help-circle-outline" size={28} />
                            </Pressable>
                        </View>
                    </SafeAreaView>
                    <View style={styles.productImageContainer}>
                        {priceId.imageName ?
                            /* @ts-ignore */
                            <Image source={`https://static.c4n.net/${priceId.imageName}`} placeholder={{thumbhash: thumbhashes[priceId.imageName]}} placeholderContentFit="none" contentFit="cover" cachePolicy="disk" style={{height: IMAGE_DIM, width: IMAGE_DIM}} transition={400} /> :
                            <View style={{height: NO_IMAGE_DIM, justifyContent: 'center', alignItems: 'center'}}>
                                <Text>No image</Text>
                            </View>}
                    </View>
                    <GestureDetector gesture={composed}>
                        <View style={styles.offsetContainer}>
                            <Animated.View style={[styles.priceContainer, transformStyles]}>
                                <Pressable onPress={() => router.replace(`/category/${priceId.category.endsWith('s') ? priceId.category.slice(0, -1) : priceId.category}`)}>
                                    <Text style={styles.categoryText}>{priceId.category}</Text>
                                </Pressable>
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
                                        isChecked={isOrganic}
                                        onPress={setIsOrganic}
                                    />
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.dollarSign}>$</Text>
                                        <TextInput
                                            style={styles.priceInput}
                                            placeholder="0.00"
                                            selectionColor={Colors.accent.background}
                                            value={priceInput}
                                            onFocus={() => {
                                                if (!isImageHidden.value) {
                                                    transformImage(true);
                                                }
                                            }}
                                            onEndEditing={() => {
                                                if (isImageHidden.value) {
                                                    transformImage(false);
                                                }
                                            }}
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
                                                <ActivityIndicator color='#fff' style={{paddingVertical: 1}} />
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
                                    <View style={styles.resultPriceContainer}>
                                        <Text style={styles.priceLabel}>Your price</Text>
                                        <Text style={styles.priceData}>${parseFloat(priceInput)} / {selectedUnit?.startsWith('per') ? selectedUnit.split(' ').slice(1).join(' ') : selectedUnit} <Text style={{color: percentColor}}>({percentDifference}%)</Text></Text>
                                    </View>
                                    {/*<Text style={[styles.seasonText, {marginBottom: 40}]}>🗓️ {result.season}</Text>*/}
                                    {evaluationText}
                                </View>
                            </Animated.View>
                        </View>
                    </GestureDetector>
                </View>
            </TouchableWithoutFeedback>
        </GestureDetector>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerButton: {
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    productImageContainer: {
        alignItems: 'center',
        backgroundColor: '#eaeceb',
        width: '100%'
    },
    offsetContainer: {
        flex: 1,
        position: 'relative'
    },
    priceContainer: {
        position: 'absolute',
        height: '200%',
        width: '100%',
        padding: 30,
        backgroundColor: '#fff',
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
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
    },
    comparisonText: {
        fontSize: 24
    },
    percentText: {
        fontWeight: 'bold'
    }
});