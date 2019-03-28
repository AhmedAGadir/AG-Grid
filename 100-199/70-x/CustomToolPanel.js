function CustomToolPanel() {
}

CustomToolPanel.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    this.eGui.style.textAlign = "center";
    this.eGui.innerHTML = this.getTemplate();
};

CustomToolPanel.prototype.getGui = function () {
    return this.eGui;
};

CustomToolPanel.prototype.getTemplate = function() { 
    return `
      <div>
        <h3>Quick Filter</h3>
        <label>
            <input type="text" id="quick-filter" oninput="onQuickFilterChanged(event)" />
        </label>
        <h3>External Filter</h3>
        <label>
            <input type="radio" name="filter" value="everyone" checked onchange="externalFilterChanged('everyone')"/> Everyone
        </label>
        <label>
            <input type="radio" name="filter" value="below30" onchange="externalFilterChanged('below30')"/> Below 30
        </label>
        <label>
            <input type="radio" name="filter" value="between30and50" onchange="externalFilterChanged('between30and50')"/> Between 30 and 50
        </label>
        <label>
            <input type="radio" name="filter" value="above50" onchange="externalFilterChanged('above50')"/> Above 50
        </label>
        <label>
            <input type="radio" name="filter" value="dateAfter2008" onchange="externalFilterChanged('dateAfter2008')"/> After 01/01/2008
        </label>
      </div>`;
}