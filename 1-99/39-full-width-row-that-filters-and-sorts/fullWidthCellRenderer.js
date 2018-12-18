function FullWidthCellRenderer() {}

FullWidthCellRenderer.prototype.init = function(params) {    
    this.eGui = document.createElement('div');
    this.eGui.classList.add('span-tag-container')
    params.data.tags.forEach(tag => {
        let spanTag = document.createElement('span');
        spanTag.classList.add('span-tag')
        spanTag.innerText = tag;
        this.eGui.appendChild(spanTag)
    })
};

FullWidthCellRenderer.prototype.getGui = function() {
    return this.eGui;
};
