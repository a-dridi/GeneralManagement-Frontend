import { Decision } from "./decision.model";

export class CriteriaOption {
    criteriaoptionId: number;
    criteriaTitle: string;
    criteriaWeighting: number;
    decision: Decision;
    userId: number;
}