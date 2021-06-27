export interface DatabaseNote {
    id: number;
    appTable: string;
    noteText: string;
    date: Date;
    userId: number;
}