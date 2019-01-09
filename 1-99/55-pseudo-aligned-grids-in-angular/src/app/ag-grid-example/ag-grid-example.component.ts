import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import "ag-grid-enterprise";

@Component({
    selector: 'app-ag-grid-example',
    templateUrl: './ag-grid-example.component.html',
    styleUrls: ['./ag-grid-example.component.scss']
})
export class AgGridExampleComponent {


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
                headerName: 'Group1',
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
        const bottomHScrollPos = this.bottomGridApi.gridPanel.getHScrollPosition();
        this.topGridApi.gridPanel.setHorizontalScrollPosition(bottomHScrollPos.left);
    }

    onScrollBottomGrid() {
        const topHScrollPos = this.topGridApi.gridPanel.getHScrollPosition();
        this.bottomGridApi.gridPanel.setHorizontalScrollPosition(topHScrollPos.left);
    }

    onTopColumnResized({ columns, finished }) {
        if (!finished) {
            this.resizeBottomGrid(columns);
        }
    }

    onBottomColumnResized({ columns, finished }) {
        if (!finished) {
            this.resizeTopGrid(columns);
        }
    }

    resizeTopGrid(columns) {
        const bottomColGroupWidth =
            columns.length > 1  // columns.length > 1 when a column group is being resized
                ? columns.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth })).actualWidth
                : columns[0].parent.children.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth })).actualWidth;

        const bottomColGroupId = columns[0].parent.groupId;
        const topColGroup = this.topGridColumnApi.getColumnGroup(bottomColGroupId);
        const topColGroupWidth = topColGroup.children.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth })).actualWidth;

        topColGroup.children.forEach(col => {
            const newWidth = col.actualWidth + (bottomColGroupWidth - topColGroupWidth) / topColGroup.children.length;
            this.topGridColumnApi.setColumnWidth(col, newWidth, true); // set finished to true to prevent inifinite loop
        });
    }

    resizeBottomGrid(columns) {
        const topColGroupWidth =
            columns.length > 1  // columns.length > 1 when a column group is being resized
                ? columns.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth, })).actualWidth
                : columns[0].parent.children.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth, })).actualWidth;

        const topColGroupId = columns[0].parent.groupId;
        const bottomColGroup = this.bottomGridColumnApi.getColumnGroup(topColGroupId);
        const bottomColGroupWidth = bottomColGroup.children.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth })).actualWidth;

        bottomColGroup.children.forEach(col => {
            const newWidth = col.actualWidth + (topColGroupWidth - bottomColGroupWidth) / bottomColGroup.children.length;
            this.bottomGridColumnApi.setColumnWidth(col, newWidth, true); // set finished to true to prevent inifinite loop
        });
    }

}
