import { View, Text, ScrollView, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { List } from 'react-native-paper';
import Colors from '../../constants/Colors';
import React from 'react';
import * as MailComposer from 'expo-mail-composer';

export default function Help() {
    const onContactPress = () => {
        if (process.env.EXPO_PUBLIC_SUPPORT_EMAIL) MailComposer.composeAsync({
            recipients: [process.env.EXPO_PUBLIC_SUPPORT_EMAIL]
        }).then().catch();
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.accordion}>
                    <List.AccordionGroup>
                        <List.Accordion titleNumberOfLines={2} title="How does the app determine the average price of produce in my region?" id="1">
                            <Text style={styles.accordionText}>The app uses weekly reports from the United States Department of Agriculture (USDA). The USDA gathers data from thousands of retailers around the nation to determine the average price retailers are selling that item for.</Text>
                        </List.Accordion>
                        <List.Accordion title="What is a PLU code, and where can I find it?" id="2">
                            <Text style={styles.accordionText}>A PLU (Price Look-Up) code is a four or five-digit number assigned to fresh produce items to help identify the specific type of fruit or vegetable at the checkout counter. You can usually find the PLU code on a small sticker attached to the produce. Simply enter this code into the app to quickly access information about the item and evaluate its price.</Text>
                        </List.Accordion>
                        <List.Accordion titleNumberOfLines={2} title="How often is the average price data updated?" id="3">
                            <Text style={styles.accordionText}>Most price data is updated once a week on Saturday or Sunday.</Text>
                        </List.Accordion>
                        <List.Accordion titleNumberOfLines={2} title="Can I use the app to compare prices between different stores in my area?" id="4">
                            <Text style={styles.accordionText}>At the moment, our app primarily focuses on evaluating individual produce items, not between different local stores.</Text>
                        </List.Accordion>
                        <List.Accordion titleNumberOfLines={2} title="How is the evaluation affected by the region I selected?" id="5">
                            <Text style={styles.accordionText}>The region selection ensures that the price evaluation is tailored to your specific region. Produce prices can vary significantly from one location to another due to factors like transportation costs, local demand, and regional availability.</Text>
                        </List.Accordion>
                        <List.Accordion titleNumberOfLines={2} title={`What do the terms "cheap", "fair", and "expensive" mean?`} id="6">
                            <Text style={styles.accordionText}>The terms "cheap," "fair," and "expensive" are relative to the average price of the selected produce item in your region. These classifications help you quickly assess whether the displayed price is a good deal compared to what is commonly observed in your area.</Text>
                        </List.Accordion>
                        <List.Accordion titleNumberOfLines={2} title="How can I report inaccurate pricing information in the app?" id="7">
                            <Text style={styles.accordionText}>If you notice inaccurate pricing information, please send us a message through the "Contact Us" button below or in the menu tab.</Text>
                        </List.Accordion>
                        <List.Accordion titleNumberOfLines={2} title="Can the app be used for online grocery shopping or only in physical stores?" id="8">
                            <Text style={styles.accordionText}>The app can be used for both online and physical grocery shopping. However, most online grocery stores markup their prices... you didn't hear that from me.</Text>
                        </List.Accordion>
                        <List.Accordion titleNumberOfLines={2} title="Is there a limit to the number of items I can evaluate in a day?" id="9">
                            <Text style={styles.accordionText}>As of now, there are no limits. You can evaluate as many items as you’d like at this time.</Text>
                        </List.Accordion>
                        <List.Accordion titleNumberOfLines={2} title="How can I provide feedback or suggest improvements for the app?" id="10">
                            <Text style={styles.accordionText}>You can provide feedback either through the feedback form or through our email, which can be found in the menu tab. We are open to any feedback or suggestions you have for us!</Text>
                        </List.Accordion>
                    </List.AccordionGroup>
                </View>
                <Text style={styles.helpText}>Still need help?</Text>
                <View style={styles.button}>
                    <Pressable onPress={onContactPress}>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.buttonText}>Contact Us</Text>
                        </View>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    accordion: {
        marginBottom: 36
    },
    accordionText: {
        padding: 16
    },
    helpText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24
    },
    button: {
        alignItems: 'center'
    },
    buttonContainer: {
        backgroundColor: Colors.light.tint,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 24
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    }
});