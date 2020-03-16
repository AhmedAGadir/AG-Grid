function TotalAndFilteredRowCountComponent() { }

TotalAndFilteredRowCountComponent.prototype.init = function (params) {
    this.params = params;

    this.eGui = document.createElement('div');
    this.eGui.className = 'ag-name-value';

    var label = document.createElement('span');
    label.innerText = 'Rows: ';
    this.eGui.appendChild(label);

    this.eCount = document.createElement('span');
    this.eCount.className = 'ag-name-value-value';

    this.eGui.appendChild(this.eCount);
};

TotalAndFilteredRowCountComponent.prototype.getGui = function () {
    return this.eGui;
};

TotalAndFilteredRowCountComponent.prototype.destroy = function () { };

TotalAndFilteredRowCountComponent.prototype.updateTotals = function (total) {
    this.eCount.innerText = total;
};
