export default class TextAreaCellRenderer {
  constructor() {}

  init(params) {
    this.params = params;

    // Create DOM elements
    this.eGui = document.createElement("div");
    this.textArea = document.createElement("textarea");
    this.textSpan = document.createElement("span");
    this.textArea.innerText = params.value || "";
    this.textSpan.innerText = params.value || "";

    this.textArea.style.height = "100%";
    this.textArea.style.width = "100%";

    this.eGui.appendChild(this.textArea);
    this.eGui.appendChild(this.textSpan);

    // Event bindings
    this.textArea.addEventListener(
      "input",
      this.textAreaInputHandler.bind(this)
    );

    this.textArea.addEventListener(
      "keydown",
      this.keyDownChangeHandler.bind(this)
    );

    if (editEnabled) {
      this.textArea.style.display = "block";
      this.textSpan.style.display = "none";
    } else {
      this.textArea.style.display = "none";
      this.textSpan.style.display = "block";
    }
  }

  // Event Handlers

  keyDownChangeHandler(e) {
    // e.stopPropagation();
  }

  textAreaInputHandler(e) {
    this.params.setValue(e.target.value);
  }

  refresh() {
    return true;
  }

  getGui() {
    return this.eGui;
  }

  destroy() {}
}