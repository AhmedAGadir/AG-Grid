import {Component} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'child-cell',
    template: `<span>{{getRowGroups()}}</span>`,
})
export class CustomHeader implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
    }

    public getRowGroups(): string {
        return this.params.columnApi.getRowGroupColumns().map(rowGroup => rowGroup.colId).join(' -> ');
    } 

    refresh(): boolean {
        return false;
    }
}