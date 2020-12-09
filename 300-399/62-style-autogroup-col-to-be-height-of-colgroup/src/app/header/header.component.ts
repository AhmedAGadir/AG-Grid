import { Component, OnInit } from "@angular/core";
import { IHeaderAngularComp } from "ag-grid-angular";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements IHeaderAngularComp {
  params;
  headerSettings;
  constructor() {}

  agInit(params) {
    this.params = params;
    this.headerSettings = params.context && params.context.headerSettings;
  }

  getStyles() {
    // console.log("getStyles", this.params);
    

    if (
      this.params.displayName !== "" &&
      this.params.displayName !== "don't show"
    ) {
      return {
        "background-color": this.headerSettings && this.headerSettings.bgColor,
        color: this.headerSettings && this.headerSettings.color,
        "font-size": this.headerSettings && this.headerSettings.fontSize + "px"
      };
    } else {
      if (this.params.context.headerSettings) {
        this.params.displayName = "don't show";
        return {
          "background-color": this.params.context.headerSettings.bgColor,
          color: this.headerSettings && this.headerSettings.color,
          "font-size": "0px"
        };
      }
    }
  }
}
