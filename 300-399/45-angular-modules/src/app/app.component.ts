import { Component } from '@angular/core';

import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection';
import { ClipboardModule } from '@ag-grid-enterprise/clipboard';

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    RangeSelectionModule,
    ClipboardModule,
]);

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    private gridApi;
    private gridColumnApi;

    private columnDefs;
    private rowData;
    private rowSelection;
    private defaultColDef;

    constructor() {
        this.defaultColDef = {
            resizable: true,
            sortable: true,
            filter: true,
        };
        this.columnDefs = [
            {
                headerName: 'First Name',
                field: 'firstName',
                editable: true,
                colId: 'firstName',
                headerTooltip: 'First Name',
            },
            {
                headerName: 'Last Name',
                field: 'lastName',
                editable: true,
                colId: 'lastName',
                headerTooltip: 'Last Name',
            },
            {
                headerName: 'City',
                field: 'city',
                editable: true,
                colId: 'city',
                headerTooltip: 'City',
            },
            {
                headerName: 'Active',
                field: 'active',
                editable: true,
                minWidth: 200,
                cellRenderer: function (params) {
                    var input = document.createElement('input');
                    input.type = 'checkbox';
                    if (params.node.data.active === 'Y') {
                        input.checked = true;
                    } else {
                        input.checked = false;
                    }
                    input.addEventListener('click', function (event) {
                        if ((<HTMLInputElement>event.target).checked === true) {
                            params.node.data.active = 'Y';
                        } else {
                            params.node.data.active = 'N';
                        }
                    });
                    return input;
                },
            },
        ];
        this.rowData = [
            {
                firstName: 'mark',
                lastName: 'henry',
                city: 'colorado',
                active: 'Y',
            },
            {
                firstName: 'james',
                lastName: 'bond',
                city: 'austin',
                active: 'N',
            },
            {
                firstName: 'randy',
                lastName: 'orton',
                city: 'mexico',
                active: 'Y',
            },
        ];
        this.rowSelection = 'multiple';
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }
    addItemsAtIndex() {
        var newItem = createNewRowData();
        this.gridApi.insertItemsAtIndex(0, [newItem]);
    }
    removeRows() {
        var selectedRows = this.gridApi.getSelectedRows();
        var res1 = this.gridApi.updateRowData({ remove: selectedRows });
        printResult(res1);
    }
}

function createNewRowData() {
    var newItem = {
        firstName: '',
        lastName: '',
        city: '',
        active: 'Y',
    };
    return newItem;
}

function printResult(res) {
    if (res.add) {
        res.add.forEach(function (rowNode) { });
    }
    if (res.remove) {
        res.remove.forEach(function (rowNode) { });
    }
    if (res.update) {
        res.update.forEach(function (rowNode) { });
    }
}
