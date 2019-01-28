function ValidationCellEditor() { }

var TICK_SYMBOL = '&#10004';
var CROSS_SYMBOL = '&#10005';

ValidationCellEditor.prototype.init = function (params) {
  this.isValid = true;
  this.isValidating = false;

  this.eGui = document.createElement('div');
  this.eGui.innerHTML = `
    <input value=${params.value}  />
    <span class="validating-msg hide"></span>
    <span class="validating-result hide"><span>
  `;
  this.eInput = this.eGui.querySelector('input');
  this.eValidating = this.eGui.querySelector('.validating-msg');
  this.eResult = this.eGui.querySelector('.validating-result');
  this.eInput.addEventListener('input', this.inputChanged.bind(this));
  this.eInput.addEventListener('keydown', this.keydownEvent.bind(this));
  this.eInput.addEventListener('blur', this.blurEvent.bind(this));

}

ValidationCellEditor.prototype.inputChanged = function (event) {

  this.isValid = event.target.value.length === 6;

  if (this.isValid) {
    this.eValidating.classList.add('hide');
    this.eResult.classList.remove('hide');
    this.eResult.innerHTML = TICK_SYMBOL;
  } else {
    this.eValidating.classList.remove('hide');
    this.eValidating.textContent = 'Invalid for reason x' // can conditionally render different messages using regexp
    this.eResult.classList.remove('hide');
    this.eResult.innerHTML = CROSS_SYMBOL;
  }
}

ValidationCellEditor.prototype.keydownEvent = function (event) {
  console.log("KEYDOWN EVENT CALLED");

  if (event.keyCode == 9 && !this.isValid) {
    event.stopImmediatePropagation();
  }
}

// focus and select can be done after the gui is attached
ValidationCellEditor.prototype.afterGuiAttached = function () {
  this.eInput.focus();
  this.eInput.select();

};


ValidationCellEditor.prototype.blurEvent = function (event) {
  console.log("BLUR EVENT CALLED");
  this.eInput.focus();
  this.eInput.select();
}

ValidationCellEditor.prototype.isCancelAfterEnd = function () {
  return !this.isValid || this.isValidating;
}

ValidationCellEditor.prototype.getValue = function () {
  return this.eInput.value;
}

ValidationCellEditor.prototype.getGui = function () {
  return this.eGui;
}

ValidationCellEditor.prototype.destroy = function () {
  this.eInput.removeEventListener('input', this.inputChanged);
}