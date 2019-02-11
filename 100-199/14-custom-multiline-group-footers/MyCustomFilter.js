function MyCustomFilter() { }

MyCustomFilter.prototype.init = function (params) {
    this.params = params;
    this.fieldId = params.colDef.field;

    this.eInput = document.createElement('input');
    this.eInput.type = 'text';
    this.eInput.classList.add('ag-filter-filter');
    this.eInput.addEventListener('input', event => {
        params.filterChangedCallback();
    })
}

MyCustomFilter.prototype.getGui = function () {
    return this.eInput;
}

MyCustomFilter.prototype.isFilterActive = function () {
    return this.eInput.value.length > 0;
}

MyCustomFilter.prototype.doesFilterPass = function (params) {
    if (params.data[this.fieldId] == undefined && !params.data.isFooter) {
        return false;
    }
    return params.data.isFooter || params.data[this.fieldId].toString().toLowerCase().includes(this.eInput.value.toLowerCase());
}

MyCustomFilter.prototype.getModel = function () {
    return this.eInput.value;
}

MyCustomFilter.prototype.setModel = function (val) {
    this.eInput.value = val;
}