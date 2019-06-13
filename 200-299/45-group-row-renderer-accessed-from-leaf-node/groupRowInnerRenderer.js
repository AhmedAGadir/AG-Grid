function GroupRowInnerRenderer () {}

GroupRowInnerRenderer.prototype.init = function(params) {
    this.params = params;
    
    this.eGui = document.createElement('div');

    this.eFlag = document.createElement('img');
    this.eFlag.classList.add('flag')
    this.eFlag.width = 20;
    this.eFlag.height = 15;
    this.eFlag.src = `https://flags.fmcdn.net/data/flags/mini/${this.params.flagCodes[this.params.node.key]}.png`;
    this.eGui.appendChild(this.eFlag);

    this.eTitle = document.createElement('span');
    this.eTitle.classList.add('groupTitle');
    this.eTitle.textContent = this.params.node.key;
    this.eGui.appendChild(this.eTitle);

    this.params.api.addEventListener('customEvent', params => {
        if (params.rowIndex === this.params.node.rowIndex) {
            if (this.eFlag.classList.contains('hide')) {
                this.eFlag.classList.remove('hide');
            } else {
                this.eFlag.classList.add('hide');
            }
        }
    })
};

GroupRowInnerRenderer.prototype.getGui = function() {
    return this.eGui;
};