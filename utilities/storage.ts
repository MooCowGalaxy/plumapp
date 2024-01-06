import * as SecureStore from 'expo-secure-store';

export async function hasOnboarded() {
    let result = await SecureStore.getItemAsync('has-onboarded');

    return result === 'yes';
}

export async function setOnboarding(state = true) {
    if (state) await SecureStore.setItemAsync('has-onboarded', 'yes');
    else await SecureStore.deleteItemAsync('has-onboarded');
}