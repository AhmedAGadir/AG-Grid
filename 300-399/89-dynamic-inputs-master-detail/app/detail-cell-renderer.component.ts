import { Component, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-detail-cell-renderer',
  template: `
    <div>
      <form #myForm>
        <div>
          <p *ngFor="let col of temp">
            <label>
              {{ col }}:<br />
              <input #dynamicInput id="input-{{col}}" type="text" value="{{ firstRecord.callId }}" />
            </label>
          </p>
        </div>
      </form>
    </div>
  `,
})

export class DetailCellRenderer implements ICellRendererAngularComp, AfterViewInit {
  @ViewChild('myForm') form;

  @ViewChildren('dynamicInput') inputs;
  inputArr;

  temp = ['UserName', 'office', 'Address'];

  ngAfterViewInit() { 
    this.inputArr = this.inputs.toArray().map(input => input.nativeElement);
    console.log(this.inputArr);
  }

  agInit(params: any): void {
    this.params = params;
    this.firstRecord = params.data.callRecords[0];

    params.eGridCell.addEventListener('keydown', this.keydownHandler);
  }

  keydownHandler = (e) => {
    let tab = e.key === 'Tab';
    let shiftTab = e.shiftKey && e.key === 'Tab';

    if (tab || shiftTab) {
      if (document.activeElement === this.inputArr[this.inputArr.length-1] && !shiftTab) {
        console.log('tabbing forward out');
        this.params.setSuppress(false);
      } else if (
        document.activeElement === this.inputArr[0] &&
        shiftTab
      ) {
        console.log('tabbing backwards out');
        this.params.setSuppress(false);
      } else {
        console.log('tabbing throughout');
        this.params.setSuppress(true);
      }
    }

    if (
      shiftTab &&
      !this.inputArr.some((elem) => elem.contains(e.target))
    ) {
      console.log('focusing on last input');
      e.preventDefault();
      this.inputArr[this.inputArr.length-1].focus();
    }

    console.log('suppress is ', this.params.getSuppress());
  };

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return false;
  }

  destroy() {
    this.params.eGridCell.removeEventListener('keydown', this.keydownHandler);
  }
}
