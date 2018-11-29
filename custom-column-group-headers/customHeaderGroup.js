function CustomHeaderGroup() {
}

CustomHeaderGroup.prototype.init = function (params) {
    this.params = params;
    this.eGui = document.createElement('div');
    this.eGui.style.width = '1000px'
    this.eGui.style.backgroundColor = 'green'
    this.eGui.className = 'ag-header-group-cell-label';
    this.eGui.innerHTML = '<div class="customHeaderLabel">' + this.params.displayName + ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet earum eius fugit dicta! Magni nobis possimus ut maiores aperiam necessitatibus deserunt omnis, dicta dolorem exercitationem sequi reprehenderit animi voluptas cupiditate!' + '</div>'
};

CustomHeaderGroup.prototype.getGui = function () {
    return this.eGui;
};
