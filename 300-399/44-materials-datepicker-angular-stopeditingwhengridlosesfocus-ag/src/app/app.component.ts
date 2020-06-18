import { Component } from "@angular/core";
import { MyDateEditor } from "./my-date-editor.component";
import { MakeEditor } from './make-editor.component';

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  popupParent: any;
  columnDefs: any;
  rowData: any;
  frameworkComponents: any;

  constructor() {
    this.popupParent = document.querySelector("body");

    this.columnDefs = [
      { field: "date", cellEditor: "myDateEditor", editable: true },
      { field: "make", cellEditor: 'makeEditor', editable: true },
      { field: "model" }
    ];

    this.rowData = [
      { make: "Porsche", model: "Boxter", date: "24/04/1993" },
      { make: "Toyota", model: "Celica", date: "24/04/1993" },
      { make: "Ford", model: "Mondeo", date: "24/04/1993" }
    ];

    this.frameworkComponents = {
      myDateEditor: MyDateEditor,
      makeEditor: MakeEditor
    };
  }
}
