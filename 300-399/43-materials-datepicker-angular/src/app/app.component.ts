import { Component } from '@angular/core';
import { MyDateEditor } from './my-date-editor.component';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent  {

    columnDefs = [
        {field: 'date', cellEditor: 'myDateEditor', editable: true},
        {field: 'make' },
        {field: 'model' },
    ];


    rowData = [
        { make: 'Porsche', model: 'Boxter', date: '24/04/1993' },
        { make: 'Toyota', model: 'Celica', date: '24/04/1993' },
        { make: 'Ford', model: 'Mondeo', date: '24/04/1993' }
    ];

    frameworkComponents = {
      myDateEditor: MyDateEditor
    }

}