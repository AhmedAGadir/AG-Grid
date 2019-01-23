import { Component, ViewChild, ViewContainerRef } from "@angular/core";

import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode } from "ag-grid-community";
import { IFilterAngularComp } from "ag-grid-angular";

@Component({
    selector: 'filter-cell',
    template: `
        <div class="container">
            More Than or Equal To: <input #input (ngModelChange)="onChange($event)" [ngModel]="number" type="number" class="form-control">
        </div>
    `, styles: [
        `
            .container {
                border: 2px solid #22ff22;
                border-radius: 5px; 
                background-color: #bbffbb;
                width: 200px;
                height: 50px
            }
            
            input {
                height: 20px
            }
        `
    ]
})
export class MoreThanOrEqualToFilter implements IFilterAngularComp {
    private params: IFilterParams;
    private valueGetter: (rowNode: RowNode) => any;
    public filterVal: string = '';

    @ViewChild('input', { read: ViewContainerRef }) public input;

    agInit(params: IFilterParams): void {
        this.params = params;
        this.valueGetter = params.valueGetter;
    }

    isFilterActive(): boolean {
        return this.filterVal !== null && this.filterVal !== undefined && this.filterVal !== 0;
    }

    doesFilterPass(params: IDoesFilterPassParams): boolean {
        return this.valueGetter(params.node) >= this.filterVal
    }

    getModel(): any {
        return this.filterVal;
    }

    setModel(model: any): void {
        this.filterVal = model ? model : null;
    }

    onChange(newValue): void {
        this.filterVal = newValue !== null ? newValue : 0;
        this.params.filterChangedCallback();
    }

    onFloatingFilterChanged(change) {
        this.onChange(change);
        this.input.element.nativeElement.value = change;
    }

    ngAfterViewInit(params: IAfterGuiAttachedParams): void {
        window.setTimeout(() => {
            this.input.element.nativeElement.focus();
        })
    }

    // noinspection JSMethodCanBeStatic
    componentMethod(message: string): void {
        alert(`Alert from MoreThanOrEqualToFilter
         ${message}`);
    }
}
