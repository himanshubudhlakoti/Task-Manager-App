export const getTrimmedString = (str: string): string => {

    if (str === null || str === undefined) {

        return str;
    }
    return str.trim();
}

export function hoursToMs(hours: number): number {
    return hours * 60 * 60 * 1000;
}