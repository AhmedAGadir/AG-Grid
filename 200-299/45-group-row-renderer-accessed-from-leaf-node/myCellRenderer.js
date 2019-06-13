function MyCellRenderer() {}

MyCellRenderer.prototype.init = function(params) {
  this.params = params;
  this.eGui = document.createElement('button');
  this.eGui.textContent = 'Click me'
  this.eGui.addEventListener('click', this.clickHandler.bind(this))
}

MyCellRenderer.prototype.getGui = function() {
  return this.eGui;
}

MyCellRenderer.prototype.clickHandler = function() {
  this.params.api.dispatchEvent({
    // can name this event anything
    type: 'customEvent', 
    rowIndex: this.params.node.parent.rowIndex
  });
}