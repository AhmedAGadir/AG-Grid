import {Component} from "@angular/core";

import {IFloatingFilter, IFloatingFilterParams, NumberFilter, NumberFilterModel} from "@ag-grid-community/all-modules";
import {AgFrameworkComponent} from "@ag-grid-community/angular";

export interface SliderFloatingFilterParams extends IFloatingFilterParams {
    value: number
    maxValue: number
}

@Component({
    template: `
        <input type="range"
               min="0" [max]="maxValue"
               data-show-value="true" data-popup-enabled="true"
               [(ngModel)]="currentValue"
               (ngModelChange)="valueChanged()"/>`
})
export class SliderFloatingFilter implements IFloatingFilter, AgFrameworkComponent<SliderFloatingFilterParams> {

    private params: SliderFloatingFilterParams;

    public maxValue: number;
    public currentValue: number;

    agInit(params: SliderFloatingFilterParams): void {
        this.params = params;
        this.maxValue = this.params.maxValue;
        this.currentValue = 0;
    }

    valueChanged() {
        console.log('valuEcHANGED')
        let valueToUse = (this.currentValue === 0) ? null : this.currentValue;
        this.params.parentFilterInstance(instance => {
            instance.onFloatingFilterChanged(valueToUse);
        })
    }

    onParentModelChanged(parentModel: NumberFilterModel): void {
        console.log('onParentModelChanged', parentModel.value);
        // debugger;
        if (!parentModel.value) {
            this.currentValue = 0;
        } else {
            this.currentValue = parentModel.value
        }
    }

}
