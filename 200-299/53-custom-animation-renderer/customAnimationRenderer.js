const SMILEY_FACE = '&#128516;';
const SAD_FACE = '&#128549;';

function CustomAnimationRenderer() {}

CustomAnimationRenderer.prototype.init = function(params) {
    this.eGui = document.createElement('span');
    this.eGui.innerHTML = '<span>' +
    '<span class="ag-value-change-delta"></span>' +
    '<span class="ag-value-change-value"></span>' +
    '</span>';

    this.eValue = this.eGui.querySelector('.ag-value-change-value');
    this.eDelta = this.eGui.querySelector('.ag-value-change-delta');

    this.eValue.innerHTML = params.valueFormatted ? params.valueFormatted : params.value;

    this.refreshCount = 0;
    this.lastValue = 0;
}

CustomAnimationRenderer.prototype.getGui = function() {
    return this.eGui
}

CustomAnimationRenderer.prototype.refresh = function(params) {
    if (params.value === this.lastValue) {
        return;
    } 
    this.eValue.innerHTML = params.valueFormatted ? params.valueFormatted : params.value;

    if (typeof params.value === 'number' && typeof this.lastValue === 'number') {
        let delta = params.value - this.lastValue;
        this._showDelta(params, delta);
    }

    // if (this.lastValue) {
    //     this._addOrRemoveClass(this.eValue, 'ag-value-change-value-highlight', true)
    // }

    this._setTimerToRemoveDelta()
    this.lastValue = params.value;
    return true;
}

CustomAnimationRenderer.prototype._showDelta = function(params, delta) {
    let absDelta = Math.abs(delta);
    let valueFormatted = params.formatValue(absDelta);
    let valueToUse = valueFormatted ? valueFormatted : absDelta;
    let deltaUp = delta >= 0; 
    if (deltaUp) {
        this.eDelta.innerHTML = SMILEY_FACE + valueToUse;
    } else {
        this.eDelta.innerHTML = SAD_FACE + valueToUse
    }

    this._addOrRemoveClass(this.eDelta, 'ag-value-change-delta-up', deltaUp)
    this._addOrRemoveClass(this.eDelta, 'ag-value-change-delta-down', !deltaUp)
}

CustomAnimationRenderer.prototype._setTimerToRemoveDelta = function () {
    var _this = this;
    // the refreshCount makes sure that if the value updates again while
    // the below timer is waiting, then the below timer will realise it
    // is not the most recent and will not try to remove the delta value.
    this.refreshCount++;
    var refreshCountCopy = this.refreshCount;
    setTimeout(function () {
        if (refreshCountCopy === _this.refreshCount) {
            _this.hideDeltaValue();
        }
    }, 2000);
}

CustomAnimationRenderer.prototype.hideDeltaValue = function() {
    // this._addOrRemoveClass(this.eValue, 'ag-value-change-value-highlight', false);
    this.eDelta.innerHTML = '';
}

CustomAnimationRenderer.prototype._addOrRemoveClass = function(element, className, shouldAdd) {
    if(shouldAdd) {
        element.classList.add(className);
    } else {
        element.classList.remove(className);
    }
}