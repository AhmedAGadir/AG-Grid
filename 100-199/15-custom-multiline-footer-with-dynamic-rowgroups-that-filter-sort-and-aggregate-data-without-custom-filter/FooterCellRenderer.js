function FooterCellRenderer() { }

FooterCellRenderer.prototype.init = function (params) {
    this.params = params;
    this.colId = params.column.colId;

    this.eGui = document.createElement('div');
    this.eGui.innerHTML = params.node.group ? '' : params.data.isFooter ? this.getFooterVal(params.data) : params.value;
}

FooterCellRenderer.prototype.getGui = function () {
    return this.eGui;
}

FooterCellRenderer.prototype.getFooterVal = function (data) {
    const groupingBy = this.params.columnApi.getRowGroupColumns().map(col => col.colId);
    const groupedRows = [];
    this.params.api.forEachNodeAfterFilter(node => {
        if (node.group) return;
        if (groupingBy.every(field => node.data[field] == data[field] && !node.data.isFooter)) {
            groupedRows.push(node)
        }
    });
    switch (data.athlete) {
        case 'Minimum': {
            return groupedRows
                .map(node => node.data[this.colId])
                .reduce((min, current) => min < current ? min : current);
        }
        case 'Maximum': {
            return groupedRows
                .map(node => node.data[this.colId])
                .reduce((max, current) => max > current ? max : current);
        }
        case 'Total': {
            return groupedRows
                .map(node => node.data[this.colId])
                .reduce((sum, current) => sum + current);
        }
    }
}