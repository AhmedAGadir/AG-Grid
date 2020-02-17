import {Component, ViewChild, ViewContainerRef} from "@angular/core";

import {IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode} from "@ag-grid-community/all-modules";
import {IFilterAngularComp} from "@ag-grid-community/angular";

@Component({
    selector: 'filter-cell',
    template: `
        <div class="container">
            <input #input (ngModelChange)="onChange($event)" [ngModel]="text" class="form-control">
        </div>
    `, styles: [
        `
            .container {
                border: 2px solid #22ff22;
                border-radius: 5px;
                background-color: #bbffbb;
                width: 200px;
                height: 25px
            }
            
            input {
                height: 20px
            }
        `
    ]
})
export class CustomNumberFilter implements IFilterAngularComp {
    private params: IFilterParams;
    public val: any = '';

    @ViewChild('input', {read: ViewContainerRef}) public input;

    agInit(params: IFilterParams): void {
        this.params = params;
    }

    isFilterActive(): boolean {
        return this.val !== null && this.val !== undefined && this.val !== '';
    }

    doesFilterPass(params: IDoesFilterPassParams): boolean {
      return params.data[this.params.colDef.field] === this.val
    }

    getModel(): any {
        return {value: this.val};
    }

    setModel(model: any): void {
        console.log('setModel', model)
        this.val = model ? model.value : '';
    }

    ngAfterViewInit(params: IAfterGuiAttachedParams): void {
        window.setTimeout(() => {
            this.input.element.nativeElement.focus();
        })
    }

    // noinspection JSMethodCanBeStatic
    componentMethod(message: string): void {
        alert(`Alert from PartialMatchFilterComponent ${message}`);
    }

    onChange(newValue): void {
        if (this.val !== newValue) {
            this.val
             = newValue == 0 ? '' : Number(newValue);
            this.params.filterChangedCallback();
        }
    }

    onFloatingFilterChanged(value) {
        console.log('onFloatingFilterChanged')
        this.setModel({value});
        this.params.filterChangedCallback();
    }

}
