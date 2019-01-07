import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import "ag-grid-enterprise";
@Component({
    selector: 'my-app',
    template: `

        <ag-grid-angular
                style="width: 100%; height: 45%"
                #topGrid
                class="ag-theme-balham"
                [enableColResize]="true"
                [groupSuppressAutoColumn]="true"
                [rowData]="normalRowData"
                [columnDefs]="columnDefsTop"
                (gridReady)="onTopGridReady($event)"
                (bodyScroll)="onScrollBottomGrid()"
                (columnResized)="onTopColumnResized($event)">
        </ag-grid-angular>

        <ag-grid-angular
                style="width: 100%; height: 45%"
                #bottomGrid
                class="ag-theme-balham"
                [enableColResize]="true"
                [groupSuppressAutoColumn]="true"
                [groupDefaultExpanded]="groupDefaultExpanded"
                [treeData]="true"
                [getDataPath]="getDataPath"
                [rowData]="treeRowData"
                [autoGroupColumnDef]="autoGroupColumnDef"
                [columnDefs]="columnDefsBottom"
                (gridReady)="onBottomGridReady($event)"
                (bodyScroll)="onScrollTopGrid()"
                (columnResized)="onBottomColumnResized($event)">
        </ag-grid-angular>
    `,
})
export class AppComponent {
    topGridApi;
    topGridColumnApi;
    bottomGridApi;
    bottomGridColumnApi;

    columnDefsTop;
    columnDefsBottom;
    normalRowData;
    treeRowData;
    groupDefaultExpanded;
    getDataPath;
    autoGroupColumnDef;

    @ViewChild('topGrid') topGrid;
    @ViewChild('bottomGrid') bottomGrid;

    constructor(private http: HttpClient) {
        this.columnDefsTop = [
            {
                headerName: 'Group',
                cellRenderer: 'agGroupCellRenderer',
                width: 250,
                showRowGroup: true,
                pinned: 'left',
            },
            {
                headerName: 'Group1',
                children: [
                    { field: 'jobTitle', width: 200 },
                    { field: 'employmentType', width: 400 },
                ],
            },
            {
                headerName: 'Group2',
                children: [
                    { field: 'jobTitle', width: 200 },
                    { field: 'employmentType', width: 200 },
                ],
            },
            {
                headerName: 'Group3',
                children: [
                    { field: 'jobTitle', width: 200 },
                    { field: 'employmentType', width: 200 },
                    { field: 'employmentType', width: 200 },
                ],
            },
        ];

        this.columnDefsBottom = [
            {
                headerName: 'Group',
                cellRenderer: 'agGroupCellRenderer',
                width: 250,
                showRowGroup: true,
                pinned: 'left',
            },
            {
                headerName: 'Group1',
                children: [
                    { field: 'jobTitle', width: 200 },
                    { field: 'employmentType', width: 200 },
                    { field: 'employmentType', width: 200 },
                ],
            },
            {
                headerName: 'Group2',
                children: [
                    { field: 'jobTitle', width: 200 },
                    { field: 'employmentType', width: 200 },
                ],
            },
            {
                headerName: 'Group3',
                children: [
                    { field: 'jobTitle', width: 200 },
                    { field: 'employmentType', width: 400 },
                ],
            },
        ];

        this.normalRowData = [
            { jobTitle: 'x CEO', employmentType: 'x Permanent' },
            { jobTitle: 'x Exec. Vice President', employmentType: 'x Permanent' },
            { jobTitle: 'x Director of Operations', employmentType: 'x Permanent' },
            { jobTitle: 'x Fleet Coordinator', employmentType: 'x Permanent' },
            { jobTitle: 'x Parts Technician', employmentType: 'x Contract' },
            { jobTitle: 'x Service Technician', employmentType: 'x Contract' },
            { jobTitle: 'x Inventory Control', employmentType: 'x Permanent' },
        ];

        this.treeRowData = [
            {
                orgHierarchy: ['Erica Rogers'],
                jobTitle: 'CEO',
                employmentType: 'Permanent',
            },
            {
                orgHierarchy: ['Erica Rogers', 'Malcolm Barrett'],
                jobTitle: 'Exec. Vice President',
                employmentType: 'Permanent',
            },

            {
                orgHierarchy: [
                    'Erica Rogers',
                    'Malcolm Barrett',
                    'Esther Baker',
                ],
                jobTitle: 'Director of Operations',
                employmentType: 'Permanent',
            },
            {
                orgHierarchy: [
                    'Erica Rogers',
                    'Malcolm Barrett',
                    'Esther Baker',
                    'Brittany Hanson',
                ],
                jobTitle: 'Fleet Coordinator',
                employmentType: 'Permanent',
            },
            {
                orgHierarchy: [
                    'Erica Rogers',
                    'Malcolm Barrett',
                    'Esther Baker',
                    'Brittany Hanson',
                    'Leah Flowers',
                ],
                jobTitle: 'Parts Technician',
                employmentType: 'Contract',
            },
            {
                orgHierarchy: [
                    'Erica Rogers',
                    'Malcolm Barrett',
                    'Esther Baker',
                    'Brittany Hanson',
                    'Tammy Sutton',
                ],
                jobTitle: 'Service Technician',
                employmentType: 'Contract',
            },
            {
                orgHierarchy: [
                    'Erica Rogers',
                    'Malcolm Barrett',
                    'Esther Baker',
                    'Derek Paul',
                ],
                jobTitle: 'Inventory Control',
                employmentType: 'Permanent',
            },
        ];

        this.groupDefaultExpanded = -1;

        this.getDataPath = function (data) {
            return data.orgHierarchy;
        };

        this.autoGroupColumnDef = {
            headerName: 'Organisation Hierarchy',
            cellRendererParams: { suppressCount: true },
        };
    }

    onTopGridReady(params) {
        this.topGridApi = params.api;
        this.topGridColumnApi = params.columnApi;
    }

    onBottomGridReady(params) {
        this.bottomGridApi = params.api;
        this.bottomGridColumnApi = params.columnApi;
    }

    onScrollTopGrid() {
        let bottomHScrollPos = this.bottomGridApi.gridPanel.getHScrollPosition();
        this.topGridApi.gridPanel.setHorizontalScrollPosition(
            bottomHScrollPos.left
        );
    }

    onScrollBottomGrid() {
        let topHScrollPos = this.topGridApi.gridPanel.getHScrollPosition();
        this.bottomGridApi.gridPanel.setHorizontalScrollPosition(
            topHScrollPos.left
        );
    }

    onTopColumnResized({ columns, finished }) {
        if (finished) {
            this.resizeBottomGrid(columns);
        }
    }

    onBottomColumnResized({ columns, finished }) {
        if (finished) {
            this.resizeTopGrid(columns);
        }
    }

    resizeTopGrid(columns) {
        let bottomColGroupWidth =
            columns.length > 1
                ? columns.reduce((a, b) => ({
                    actualWidth: a.actualWidth + b.actualWidth,
                })).actualWidth
                : columns[0].parent.children.reduce((a, b) => ({
                    actualWidth: a.actualWidth + b.actualWidth,
                })).actualWidth;

        let bottomColGroupId = columns[0].parent.groupId;

        let topColGroup = this.topGridColumnApi.getColumnGroup(
            bottomColGroupId
        );
        let topColGroupWidth = topColGroup.children.reduce((a, b) => ({
            actualWidth: a.actualWidth + b.actualWidth,
        })).actualWidth;

        let difference = bottomColGroupWidth - topColGroupWidth;
        topColGroup.children.forEach(col => {
            // set finished to false on setColumnWidth to prevent inifinite loop
            this.topGridColumnApi.setColumnWidth(
                col,
                col.actualWidth + difference / topColGroup.children.length,
                false
            );
        });
    }

    resizeBottomGrid(columns) {
        // columns.length > 1 when a column group is being resized
        let topColGroupWidth =
            columns.length > 1
                ? columns.reduce((a, b) => ({
                    actualWidth: a.actualWidth + b.actualWidth,
                })).actualWidth
                : columns[0].parent.children.reduce((a, b) => ({
                    actualWidth: a.actualWidth + b.actualWidth,
                })).actualWidth;

        let topColGroupId = columns[0].parent.groupId;

        let bottomColGroup = this.bottomGridColumnApi.getColumnGroup(
            topColGroupId
        );
        let bottomColGroupWidth = bottomColGroup.children.reduce((a, b) => ({
            actualWidth: a.actualWidth + b.actualWidth,
        })).actualWidth;

        let difference = topColGroupWidth - bottomColGroupWidth;
        bottomColGroup.children.forEach(col => {
            // set finished to false on setColumnWidth to prevent inifinite loop
            this.bottomGridColumnApi.setColumnWidth(
                col,
                col.actualWidth + difference / bottomColGroup.children.length,
                false
            );
        });
    }
}
