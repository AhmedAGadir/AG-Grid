import { Component, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-detail-cell-renderer',
  template: `
    <div>
      <form>
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


  agInit(params: any): void {
    console.log('agInit', params);
    this.params = params;
    this.firstRecord = params.data.callRecords[0];

    params.eGridCell.addEventListener('keydown', this.keydownHandler);
  }

  keydownHandler = e => {
    let tabPressed = e.key === 'Tab';

    if (tabPressed) {
      if (document.activeElement === this.input3.nativeElement) {
        this.params.setSuppress(false);
      } else {
        this.params.setSuppress(true);
      }
    }
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return false;
  }

  destroy() {
    this.params.eGridCell.removeEventListener('keydown', this.keydownHandler);
  }

}
