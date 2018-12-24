function CustomLoadingOverlay() { }

CustomLoadingOverlay.prototype.init = function (params) {
    var eTemp = document.createElement('div');
    eTemp.innerHTML =
        '<div class="progress-bar blue stripes">' +
        '   <span class="bar" style="width: ' + params.progress() + '%' + '"></span>' +
        '   <span class="text">' + params.progress() + '%' + '</span>' +
        '</div>';

    this.eGui = eTemp.firstElementChild;
};

CustomLoadingOverlay.prototype.getGui = function () {
    return this.eGui;
};