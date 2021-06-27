/**
 * Creates random values of hex farb codes, etc.
 */
export class ValuesGenerator {


    /**
     *  Generate new array with random hex colors. 
     * @param colorAmount The array has a length of colorAmount.
     */
    public static getHexColorValuesArray(colorAmount): string[] {
        let generatedHexColorValues = [];
        for (let i = 0; i < colorAmount; i++) {
            generatedHexColorValues.push("#" + (Math.floor(Math.random() * 16777215).toString(16).toUpperCase()));
        }
        return generatedHexColorValues;
    }

}