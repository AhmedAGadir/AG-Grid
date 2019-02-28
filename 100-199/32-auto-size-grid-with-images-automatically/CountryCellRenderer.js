function CountryCellRenderer() {}

CountryCellRenderer.prototype.init = function(params) {
    if (params.value === undefined || params.value === null) {
        return '';
    }
    this.params = params;
    this.eGui = document.createElement('span');
    let n = Math.floor(Math.random() * 4) + 1
    for (let i = 0; i < n; i++) {
        this.eGui.appendChild(this.createImg(params.value))
    }    
}

CountryCellRenderer.prototype.getGui = function() {
    return this.eGui;
} 

CountryCellRenderer.prototype.createImg = function(value) {
    let flagImg = document.createElement('img');
    flagImg.src = 'https://flags.fmcdn.net/data/flags/mini/' + COUNTRY_CODES[value] + '.png';
    flagImg.style.cssText = "border: none; width: 30px; height=20px; margin: 0 2px";
    flagImg.addEventListener('load', this.params.onImageLoaded);

    return flagImg;
}


