import { identifierModuleUrl } from '@angular/compiler'

export interface DatabaseNote {
    id: number;
    table: string;
    noteText: string;
    date: Date;
    userId: number;
}