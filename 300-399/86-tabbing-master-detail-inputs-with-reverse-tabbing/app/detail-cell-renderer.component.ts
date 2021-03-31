import { Component, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-detail-cell-renderer',
  template: `
    <div>
      <form #myForm>
        <div>
          <p>
            <label>
              Call Id:<br />
              <input #input1 type="text" value="{{ firstRecord.callId }}" />
            </label>
          </p>
          <p>
            <label>
              Number:<br />
              <input #input2 type="text" value="{{ firstRecord.number }}" />
            </label>
          </p>
          <p>
            <label>
              Direction:<br />
              <input #input3 type="text" value="{{ firstRecord.direction }}" />
            </label>
          </p>
        </div>
      </form>
    </div>
  `,
})
export class DetailCellRenderer implements ICellRendererAngularComp {
  @ViewChild('input1') input1;
  @ViewChild('input2') input2;
  @ViewChild('input3') input3;
  @ViewChild('myForm') form;

  agInit(params: any): void {
    this.params = params;
    this.firstRecord = params.data.callRecords[0];

    params.eGridCell.addEventListener('keydown', this.keydownHandler);
  }

  keydownHandler = (e) => {
    let tab = e.key === 'Tab';
    let shiftTab = e.shiftKey && e.key === 'Tab';

    if (tab || shiftTab) {
      if (document.activeElement === this.input3.nativeElement && !shiftTab) {
        console.log('tabbing forward out');
        this.params.setSuppress(false);
      } else if (
        document.activeElement === this.input1.nativeElement &&
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
      ![
        this.input1.nativeElement,
        this.input2.nativeElement,
        this.input3.nativeElement,
      ].some((elem) => elem.contains(e.target))
    ) {
      console.log('focusing on last input');
      e.preventDefault();
      this.input3.nativeElement.focus();
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
