function MyCustomFilter() { }

MyCustomFilter.prototype.init = function (params) {
    this.params = params;
    this.fieldId = params.colDef.field;

    this.eInput = document.createElement('input');
    this.eInput.type = 'text';
    this.eInput.classList.add('ag-filter-filter');
    this.eInput.addEventListener('input', debounce(() => params.filterChangedCallback(), 500));
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

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};