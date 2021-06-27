import { DecisionOption } from "./decision-option.model";

export class Decision {
    decisionId: number;
    title: string;
    chosenOption: string;
    chosenOptionId: number;
    information: string;
    addedDate: Date;
    userId: number;
}