export const getTrimmedString = (str: string): string => {

    if (str === null || str === undefined) {

        return str;
    }
    return str.trim();
}

export const durationToMilliseconds = (duration: string): number => {

    const match = duration.trim().match(/^(\d+)\s*([smhd])$/i);

    if (!match) {
        throw new Error(
            'Invalid duration format. Supported formats: 2s, 5m, 1h, 3d'
        );
    }

    const value: number = parseInt(match[1], 10);
    const unit: string = match[2].toLowerCase();

    const multipliers: Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };
    return value * multipliers[unit];
}