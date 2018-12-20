function CustomGroupRenderer() { }

CustomGroupRenderer.prototype.init = function (params) {
    this.groupSelectionState = '';

    this.params = params;

    var eTemp = document.createElement('div');
    eTemp.innerHTML = this.getTemplate(this.params.data);
    this.eGui = eTemp.firstElementChild;

    var eCheckbox = document.createElement('input');
    eCheckbox.type = 'checkbox';
    // eCheckbox.addEventListener('click', this.masterRowSelectedHandler.bind(this));
    this.eGui.querySelector('.ag-group-checkbox').appendChild(eCheckbox);


    this.applyChevronStyles();
}

CustomGroupRenderer.prototype.getTemplate = function (data) {
    return '<span>' +
        '<span class="ag-group-expanded" ref="eExpanded">' +
        '  <span class="ag-icon ag-icon-contracted"></span>' +
        '</span>' +
        '<span class="ag-group-contracted" ref="eContracted">' +
        '  <span class="ag-icon ag-icon-expanded"></span>' +
        '</span>' +
        '<span class="ag-group-checkbox" ref="eCheckbox"></span>' +
        ' <span class="ag-group-value" ref="eValue">' + data.name + '</span>' +
        '<span class="ag-group-child-count" ref="eChildCount"></span>' +
        '</span>';
}

CustomGroupRenderer.prototype.applyChevronStyles = function () {
    this.eExpanded = this.eGui.querySelector('.ag-group-expanded');
    this.eContracted = this.eGui.querySelector('.ag-group-contracted');

    this.eExpanded.addEventListener('click', () => this.params.node.setExpanded(false));
    this.eContracted.addEventListener('click', () => this.params.node.setExpanded(true));

    this.showCorrectChevron = this.showCorrectChevron.bind(this);
    this.params.node.addEventListener('expandedChanged', this.showCorrectChevron)
    this.showCorrectChevron();
}

CustomGroupRenderer.prototype.showCorrectChevron = function () {
    var expanded = this.params.node.expanded
    this.eExpanded.style.display = expanded ? 'inline' : 'none';
    this.eContracted.style.display = expanded ? 'none' : 'inline';

}

CustomGroupRenderer.prototype.getGui = function () {
    return this.eGui;
}
