import PriceId from '../types/PriceId';
import levenshtein from './lib/levenshtein';

export default function calculateSearchScore(searchText: string, priceId: PriceId): number {
    let result = 0;

    result += levenshtein(searchText, priceId.name);
    result += levenshtein(searchText, priceId.commodity) * 0.7;

    for (const alias of priceId.alias) {
        result += levenshtein(searchText, alias) ** 3;
    }

    if (priceId.name.startsWith(searchText)) {
        result += 0.5;
    }

    return result;
}