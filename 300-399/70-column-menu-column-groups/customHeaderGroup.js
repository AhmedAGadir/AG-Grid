function CustomHeaderGroup() {}

CustomHeaderGroup.prototype.init = function (params) {
  this.params = params;
  this.eGui = document.createElement('div');
  this.eGui.className = 'ag-header-group-cell-label';
  this.eGui.innerHTML = `
    <div class="customHeaderLabel">
     ${this.params.displayName}
    </div>
    <span class="ag-icon ag-icon-menu" unselectable="on" role="presentation"></span>
    ${ag_menu}
    `;

  this.eIcon = this.eGui.querySelector('.ag-icon');

  this.eIcon.addEventListener('click', () => {
    this.params.api.showColumnMenuAfterButtonClick('shadow', this.eIcon);
  })
};

CustomHeaderGroup.prototype.getGui = function () {
  return this.eGui;
};

CustomHeaderGroup.prototype.destroy = function () {};

const ag_menu = `
<div class="ag-tabs ag-menu ag-focus-managed ag-ltr ag-popup-child" style="min-width: 242px; left: 137px; top: 57.5px;">
            <div ref="eHeader" role="menu" class="ag-tabs-header ag-menu-header"><span tabindex="-1" role="menuitem" class="ag-tab ag-tab-selected" aria-label="general"><span class="ag-icon ag-icon-menu" unselectable="on" role="presentation"></span></span><span tabindex="-1" role="menuitem" class="ag-tab" aria-label="filter"><span class="ag-icon ag-icon-filter" unselectable="on" role="presentation"></span></span><span tabindex="-1" role="menuitem" class="ag-tab" aria-label="columns"><span class="ag-icon ag-icon-columns" unselectable="on" role="presentation"></span></span></div>
            <div ref="eBody" role="presentation" class="ag-tabs-body ag-menu-body"><div class="ag-menu-list ag-focus-managed" role="tree"><div class="ag-tab-guard ag-tab-guard-top" role="presentation" tabindex="0"></div><div class="ag-menu-option" tabindex="-1" role="treeitem" aria-expanded="false" aria-level="1"><span ref="eIcon" class="ag-menu-option-part ag-menu-option-icon" role="presentation"><span class="ag-icon ag-icon-pin" unselectable="on" role="presentation"></span></span><span ref="eName" class="ag-menu-option-part ag-menu-option-text">Pin Column</span><span ref="eShortcut" class="ag-menu-option-part ag-menu-option-shortcut"></span><span ref="ePopupPointer" class="ag-menu-option-part ag-menu-option-popup-pointer"><span class="ag-icon ag-icon-small-right" unselectable="on" role="presentation"></span></span></div><div class="ag-menu-separator" aria-hidden="true">
                <div class="ag-menu-separator-part"></div>
                <div class="ag-menu-separator-part"></div>
                <div class="ag-menu-separator-part"></div>
                <div class="ag-menu-separator-part"></div>
            </div><div class="ag-menu-option" tabindex="-1" role="treeitem" aria-level="1"><span ref="eIcon" class="ag-menu-option-part ag-menu-option-icon" role="presentation"></span><span ref="eName" class="ag-menu-option-part ag-menu-option-text">Autosize This Column</span><span ref="eShortcut" class="ag-menu-option-part ag-menu-option-shortcut"></span><span ref="ePopupPointer" class="ag-menu-option-part ag-menu-option-popup-pointer"></span></div><div class="ag-menu-option" tabindex="-1" role="treeitem" aria-level="1"><span ref="eIcon" class="ag-menu-option-part ag-menu-option-icon" role="presentation"></span><span ref="eName" class="ag-menu-option-part ag-menu-option-text">Autosize All Columns</span><span ref="eShortcut" class="ag-menu-option-part ag-menu-option-shortcut"></span><span ref="ePopupPointer" class="ag-menu-option-part ag-menu-option-popup-pointer"></span></div><div class="ag-menu-separator" aria-hidden="true">
                <div class="ag-menu-separator-part"></div>
                <div class="ag-menu-separator-part"></div>
                <div class="ag-menu-separator-part"></div>
                <div class="ag-menu-separator-part"></div>
            </div><div class="ag-menu-option" tabindex="-1" role="treeitem" aria-level="1"><span ref="eIcon" class="ag-menu-option-part ag-menu-option-icon" role="presentation"></span><span ref="eName" class="ag-menu-option-part ag-menu-option-text">Reset Columns</span><span ref="eShortcut" class="ag-menu-option-part ag-menu-option-shortcut"></span><span ref="ePopupPointer" class="ag-menu-option-part ag-menu-option-popup-pointer"></span></div><div class="ag-tab-guard ag-tab-guard-bottom" role="presentation" tabindex="0"></div></div></div>
        </div>`;
