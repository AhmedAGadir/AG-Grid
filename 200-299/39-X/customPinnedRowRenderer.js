function CustomPinnedRowRenderer() { }

CustomPinnedRowRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    this.eGui.style = params.style;
    this.eGui.innerHTML = params.value;

    params.api.forEachNode(node => console.log(node))
};

CustomPinnedRowRenderer.prototype.getGui = function () {
    return this.eGui;
};