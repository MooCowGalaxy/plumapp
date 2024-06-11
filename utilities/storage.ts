import * as SecureStore from 'expo-secure-store';

export async function hasOnboarded() {
    let result = await SecureStore.getItemAsync('has-onboarded');

    return result === 'yes';
}

export async function setOnboarding(state = true) {
    if (state) await SecureStore.setItemAsync('has-onboarded', 'yes');
    else await SecureStore.deleteItemAsync('has-onboarded');
}

export async function addRecentSearch(priceId: number) {
    let recent = await getRecentSearches();

    recent = [priceId, ...recent.filter(x => x !== priceId)].slice(0, 5);
    await SecureStore.setItemAsync('recent-searches', JSON.stringify(recent));

    return recent;
}

export async function removeRecentSearch(priceId: number) {
    let recent = await getRecentSearches();

    recent = recent.filter(x => x !== priceId);
    await SecureStore.setItemAsync('recent-searches', JSON.stringify(recent));

    return recent;
}

export async function getRecentSearches(): Promise<number[]> {
    const res = await SecureStore.getItemAsync('recent-searches');

    if (!res) {
        await SecureStore.setItemAsync('recent-searches', '[]');
        return [];
    }

    return JSON.parse(res);
}

export async function getRegion(): Promise<string> {
    const res = await SecureStore.getItemAsync('region');

    if (!res) {
        await SecureStore.setItemAsync('region', 'national');
        return 'national';
    }

    return res;
}

export async function setRegion(region: string): Promise<void> {
    await SecureStore.setItemAsync('region', region);
}