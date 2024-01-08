import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useLocalSearchParams } from 'expo-router';

export default function ProductInfoScreen() {
    const local = useLocalSearchParams();

    return (
        <View>
            <Text>Product info for {local.id}</Text>
        </View>
    );
}

const styles = StyleSheet.create({

});