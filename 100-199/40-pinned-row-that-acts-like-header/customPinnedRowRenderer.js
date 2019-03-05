function CustomPinnedRowRenderer() { }

CustomPinnedRowRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = params.value;
};

CustomPinnedRowRenderer.prototype.getGui = function () {
    return this.eGui;
};