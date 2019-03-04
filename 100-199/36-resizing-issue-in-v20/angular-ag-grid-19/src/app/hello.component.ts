import { Component, Input } from '@angular/core';

@Component({
  selector: 'hello',
  template: `<h1>{{name}}!</h1>
  <p>ag-Grid used together with PrimeNG</p>`,
  styles: [`h1 { font-family: Lato; }`]
})
export class HelloComponent  {
  @Input() name: string;
}
