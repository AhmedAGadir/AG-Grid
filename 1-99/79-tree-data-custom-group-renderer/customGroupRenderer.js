function CustomGroupRenderer() { }

CustomGroupRenderer.prototype.init = function (params) {
    this.params = params;

    var eTemp = document.createElement('div');
    eTemp.innerHTML = this.getTemplate(params.value, this.isGroup(), params.node.uiLevel);
    this.eGui = eTemp.firstElementChild;

    if (this.isGroup()) {
        this.eExpanded = this.eGui.querySelector('.ag-group-expanded');
        this.eContracted = this.eGui.querySelector('.ag-group-contracted');
        this.showCorrectChevron();
        this.addEventListeners();
    }
}

CustomGroupRenderer.prototype.getTemplate = function (value, isGroup, indent) {
    let template = '<span class="ag-row-group-indent-' + indent;

    template += isGroup ? '">' : ' ag-row-group-leaf-indent">';

    template +=
        '<span class="ag-group-expanded ag-hidden" ref="eExpanded">' +
        '  <span class="ag-icon ag-icon-contracted"></span>' +
        '</span>' +
        '<span class="ag-group-contracted ag-hidden" ref="eContracted">' +
        '  <span class="ag-icon ag-icon-expanded"></span>' +
        '</span>' +
        '<span class="ag-group-checkbox" ref="eCheckbox"></span>' +
        ' <span class="ag-group-value" ref="eValue">' + value + '</span>' +
        '<span class="ag-group-child-count" ref="eChildCount"></span>' +
        '</span>';

    return template;
}

CustomGroupRenderer.prototype.isGroup = function () {
    return this.params.node.allChildrenCount !== null;
}

CustomGroupRenderer.prototype.addEventListeners = function () {
    this.eExpanded.addEventListener('click', () => this.params.node.setExpanded(false));
    this.eContracted.addEventListener('click', () => this.params.node.setExpanded(true));
    this.params.node.addEventListener('expandedChanged', this.showCorrectChevron.bind(this));
}

CustomGroupRenderer.prototype.showCorrectChevron = function () {
    if (this.params.node.expanded) {
        this.eExpanded.classList.remove('ag-hidden');
        this.eContracted.classList.add('ag-hidden');
    } else {
        this.eContracted.classList.remove('ag-hidden');
        this.eExpanded.classList.add('ag-hidden');
    }
}

CustomGroupRenderer.prototype.getGui = function () {
    return this.eGui;
}

CustomGroupRenderer.prototype.destroy = function () {
    // remove event listeners
}