export class NumberFormattingService {
    private postfixes = ['', 'k', 'm', 'b'];
    public formatInteger(n: number): string {
        return this.format(n, 0);
    }
    public formatDecimal(n: number): string {
        return this.format(n, 2);
    }
    public format(number: number, maxDecimals?: number, minDecimals?: number, ceil?: boolean): string {
        if (maxDecimals === undefined) {
            maxDecimals = 2;
        }
        if (minDecimals === undefined) {
            minDecimals = maxDecimals;
        }
        if (ceil === undefined) {
            ceil = false;
        }

        let amountOfTimesTheNumberCanBeDividedBy1000 = 0;
        while(number > 10000) {
            number /= 1000;
            amountOfTimesTheNumberCanBeDividedBy1000++;
        }

        const multiplier = Math.pow(10, maxDecimals);
        let roundedNumber;
        if (ceil) {
            number -= 0.0001; // Floating point fix.
            roundedNumber = Math.ceil(number * multiplier) / multiplier;
        } else {
            number += 0.0001; // Floating point fix.
            roundedNumber = Math.floor(number * multiplier) / multiplier;
        }

        let numberString: string;
        if (minDecimals) {
            numberString = roundedNumber.toFixed(minDecimals);
        } else {
            numberString = roundedNumber.toString();
        }

        const postfix = this.postfixes[amountOfTimesTheNumberCanBeDividedBy1000];
        if (postfix) {
            numberString += postfix;
        }
        return numberString;
    }
}