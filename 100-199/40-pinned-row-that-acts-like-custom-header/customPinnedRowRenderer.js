function CustomPinnedRowRenderer() { }

CustomPinnedRowRenderer.prototype.init = function (params) {
    this.params = params;

    this.eGui = document.createElement('div');
    this.eGui.classList.add('pinned-row');
    this.eGui.innerHTML = '<i class="fas fa-caret-up"></i><i class="fas fa-caret-down"></i>';

    this.upCarret = this.eGui.querySelector('.fa-caret-up');
    this.downCarret = this.eGui.querySelector('.fa-caret-down');

    this.eGui.addEventListener('click', () => params.api.setSortModel({}))
    this.upCarret.addEventListener('click', event => this.setSortModel(event, 'asc'));
    this.downCarret.addEventListener('click', event => this.setSortModel(event, 'desc'));
};

CustomPinnedRowRenderer.prototype.setSortModel = function (event, sort) {
    event.stopPropagation();
    this.params.api.setSortModel([{
        colId: this.params.column.colId,
        sort: sort
    }])
}

CustomPinnedRowRenderer.prototype.refresh = function (params) {
    let sortModel = params.api.getSortModel()[0];
    if (!sortModel || sortModel.colId !== params.column.colId) {
        this.upCarret.classList.remove('active');
        this.downCarret.classList.remove('active');
    } else {
        if (sortModel.sort === 'asc') {
            this.upCarret.classList.add('active');
            this.downCarret.classList.remove('active');
        } else if (sortModel.sort === 'desc') {
            this.upCarret.classList.remove('active');
            this.downCarret.classList.add('active');
        }
    }
}

CustomPinnedRowRenderer.prototype.getGui = function () {
    return this.eGui;
};