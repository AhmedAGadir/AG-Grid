import { Component } from '@angular/core';
import { GridOptions } from "ag-grid/main";

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  gridOptions: GridOptions;

  rowData: any[] = [
    { item: 'Item A', currency: 'EUR', amount: 100 },
    { item: 'Item A', currency: 'USD', amount: -20 },
    { item: 'Item A', currency: 'CHF', amount: 300 },
    { item: 'Item B', currency: 'EUR', amount: -100 },
    { item: 'Item B', currency: 'USD', amount: 20 },
    { item: 'Item B', currency: 'CHF', amount: -300 },
    { item: 'Item C', currency: 'EUR', amount: 100 },
    { item: 'Item C', currency: 'USD', amount: 20 },
    { item: 'Item C', currency: 'CHF', amount: 300 },
    { item: 'Item D', currency: 'EUR', amount: 100 },
    { item: 'Item D', currency: 'USD', amount: 20 },
    { item: 'Item D', currency: 'CHF', amount: -300 },
    { item: 'Item E', currency: 'EUR', amount: -100 },
    { item: 'Item E', currency: 'USD', amount: 20 },
    { item: 'Item E', currency: 'CHF', amount: -300 },
  ];


  ngOnInit() {
    this.gridOptions = <GridOptions>{
      autoGroupColumnDef: {
        valueGetter: params => params.data.metricName
        // cellRenderer: params => {
        //   if (params.node.isRowPinned()) {
        //     return params.data.metricName;
        //   }
        //   return params.value;
        // }
      },
      rowData: this.rowData,
      pivotMode: true,
      columnDefs: [
        { headerName: 'Item', field: 'item', colId: 'item', enablePivot: true, pivot: true, enableRowGroup: true, },
        { headerName: 'Currency', field: 'currency', rowGroup: true },
        { headerName: 'Amount', field: 'amount', enableValue: true, aggFunc: 'sum' },
      ],
      enableColResize: true,
      onGridReady: () => {
        const sum = 0;
        if (this.gridOptions.columnApi.isPivotMode()) {

          // create data 'placeholder' (array of items to be filled based on cell values)
          const pivotColumns = this.gridOptions.columnApi
            .getColumnState()
            .filter(c => c.pivotIndex !== null)
            .sort((a, b) => b.pivotIndex - a.pivotIndex);
          const columns = this.gridOptions.columnApi.getAllGridColumns();
          const footerData = columns.map(c => {
            const colDef = c.getColDef();
            const valueFieldId = colDef.pivotValueColumn
              ? colDef.pivotValueColumn.getColId()
              : '';
            const cell = {
              colId: c.getColId(),
              fieldId: valueFieldId,
              filters: []
            } as any;
            if (valueFieldId === 'amount') {
              //create properties which are going to be used for calculations with default values
              cell.sum = 0;
              cell.absoluteSum = 0;
              cell.positiveNumbersSum = 0;
              cell.negativeNumbersSum = 0;
            }
            pivotColumns.forEach(pc => {
              cell.filters.push({
                key: pc.colId,
                value: colDef.pivotKeys ? colDef.pivotKeys[pc.pivotIndex] : ''
              });
            });
            const data = {};
            data[cell.colId] = {};
            return cell;
          });
          // Fill data by calculating metrics

          this.gridOptions.api.forEachNodeAfterFilter(n => {
            if (!n.data) {
              return;
            }
            const col = footerData.find(f =>
              f.filters.every(fil => n.data[fil.key] === fil.value)
            );
            if (!col || col.fieldId !== 'amount') {
              // Metrics are to be calculated for amount field only. Calculation should be skipped for other pivot value columns - if any
              return;
            }
            const amount = n.data[col.fieldId];
            col.absoluteSum += Math.abs(amount);
            col.sum += amount;
            amount < 0
              ? (col.negativeNumbersSum += amount)
              : (col.positiveNumbersSum += amount);
          });

          const sumAbsRow = { metricName: 'Sum(abs(x))' } as any;
          const absSumRow = { metricName: 'Abs(sum)' } as any;
          const realyComplicatedMetricRow = { metricName: 'Custom Metric' } as any;
          footerData.forEach((f, index) => {
            if (isNaN(f.sum)) {
              return;
            }
            absSumRow[f.colId] = Math.abs(f.sum);
            sumAbsRow[f.colId] = f.absoluteSum;
            realyComplicatedMetricRow[f.colId] = Math.min(
              f.negativeNumbersSum,
              f.positiveNumbersSum
            );
          });
          console.log(sumAbsRow,
            absSumRow,
            realyComplicatedMetricRow)
          this.gridOptions.api.setPinnedBottomRowData([
            sumAbsRow,
            absSumRow,
            realyComplicatedMetricRow,
          ]);
        }
      }
    }
  }
}
