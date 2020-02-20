function TotalAndFilteredRowCountComponent() {
}

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

    // params.api.addEventListener('firstDataRendered', this.onGridReady.bind(this));

    params.api.addEventListener('hack', params => {
        this.eCount.innerText =  params.response.totalRows + ' total rows';
        // this.eGui.innerHTML = params.response.totalRows + ' total rows';
    });
};

TotalAndFilteredRowCountComponent.prototype.getGui = function () {
    return this.eGui;
};

TotalAndFilteredRowCountComponent.prototype.destroy = function () {
    this.params.removeEventListener("firstDataRendered", this.onGridReady);
};

TotalAndFilteredRowCountComponent.prototype.onGridReady = function () {
    

//   this.eCount.innerText = this.params.api.getModel().rowNodeBlockLoader.blocks[0].rowNodes.length

 };
