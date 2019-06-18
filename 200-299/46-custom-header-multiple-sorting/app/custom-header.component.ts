import {Component, ViewChild, ElementRef} from '@angular/core';
import {ILoadingOverlayComponentAngularComp} from "ag-grid-angular";

@Component({
    selector: 'app-loading-overlay',
    template: `
        <div>
            <div class="customHeaderLabel">{{params.displayName}}</div> 
            <div *ngIf="params.enableSorting" (click)="onSortRequested('asc')" [ngClass]="ascSort" class="customSortDownLabel"><i class="fa fa-long-arrow-alt-down"></i></div> 
            <div *ngIf="params.enableSorting" (click)="onSortRequested('asc_abs')" [ngClass]="asc_absSort" class="customSortDownLabel"><i class="fa fa-long-arrow-alt-down"></i>A</div> 
            <div *ngIf="params.enableSorting" (click)="onSortRequested('desc')" [ngClass]="descSort" class="customSortUpLabel"><i class="fa fa-long-arrow-alt-up"></i></div> 
            <div *ngIf="params.enableSorting" (click)="onSortRequested('desc_abs')" [ngClass]="desc_absSort" class="customSortUpLabel"><i class="fa fa-long-arrow-alt-up"></i>A</div> 
            <div *ngIf="params.enableSorting" (click)="onSortRequested('none')" [ngClass]="noSort" class="customSortRemoveLabel"><i class="fa fa-times"></i></div>
        </div>
    `,
    styles: [
        `
        .customHeaderMenuButton, 
        .customHeaderLabel, 
        .customSortDownLabel, 
        .customSortUpLabel, 
        .customSortRemoveLabel 
        {
            float: left;
            margin: 0 0 0 3px;
        }
    
        .customSortUpLabel {
            margin: 0;
        }

        .customSortRemoveLabel {
            font-size: 11px;
        }

        .active {
            color: cornflowerblue;
        }
    `
    ]
})
export class CustomHeader {
    private params: any;
    private sortStates: any;


    @ViewChild('menuButton', {read: ElementRef}) public menuButton;

    agInit(params): void {
        this.params = params;
        // params.column.addEventListener('sortChanged', this.onSortChanged.bind(this));


     this.sortStates = {
        asc: false,
        asc_abs: false,
        desc: false,
        desc_abs: false,
        none: false,
     }

     this.lastSortBool = false;
    }


    onSortRequested(order) {
        Object.keys(this.sortStates).forEach(key => {
            if (key === order) {
                this.sortStates[key] = true;
            } else {
                this.sortStates[key] = false;
            }
        });
        console.log(order)
        this.params.setSort(this.lastSortBool ? 'asc' : 'desc', false);
        this.lastSortBool != this.lastSortBool;
    }
}
