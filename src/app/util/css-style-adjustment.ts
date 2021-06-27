import { Injectable } from '@angular/core';


/**
 * Adjust CSS styles of components. Example: table component.
 */
@Injectable({
    providedIn: 'root'
})
export class CssStyleAdjustment {
    constructor() {

    }

    /**
     * Make table scrollable for smaller screen width.
     * @param standardWith The max width of the table (displayed in full screen) in responsive mode. 
     */
    public loadTableResponsiveStyle(standardWith) {
        if (window.innerWidth > 900 && window.innerWidth < standardWith) {
            const tableComponents = document.getElementsByClassName("p-datatable-wrapper");
            const tableComponents2 = document.getElementsByTagName("table");

            [].forEach.call(tableComponents, tableComponentItem => {
                tableComponentItem.style.overflowX = "auto";
            });

            [].forEach.call(tableComponents2, tableComponents2Item => {
                tableComponents2Item.style.width = "inherit";
            })
        }
    }
}