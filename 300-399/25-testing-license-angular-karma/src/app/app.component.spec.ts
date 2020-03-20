import { AppComponent } from './app.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';

describe('Component AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let componentInstance;

  beforeEach(done => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        BrowserModule,
        HttpClientModule,
        AgGridModule.withComponents([])
      ],
      providers: []
    });

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    componentInstance = fixture.componentInstance;

    spyOn(window.console, 'error');

    componentInstance.rowData.toPromise().then(() => {
      fixture.detectChanges();
      done();
    });
  });

  it('should display ag grid', () => {
    const gridEl = fixture.nativeElement.querySelector('.ag-theme-alpine');
    const rootWrapper = gridEl.querySelector('.ag-root-wrapper');
    expect(rootWrapper).toBeTruthy();
  });

  it('should print error message to console', () => {
    console.log('TEST OUTPUT.');
    expect(window.console.error).toHaveBeenCalled();
  });

  it('should have a Make column', () => {
    const priceColumnDiv = document.querySelector('[col-id="make"]');
    expect(priceColumnDiv).toBeTruthy();
  });

  it('should have a Model column', () => {
    const modelColumnDiv = document.querySelector('[col-id="model"]');
    expect(modelColumnDiv).toBeTruthy();
  });

  it('should have a Price column', () => {
    const priceColumnDiv = document.querySelector('[col-id="price"]');
    expect(priceColumnDiv).toBeTruthy();
  });

  it('should contain rowData', () => {
    expect(componentInstance.gridOptions.rowData).toBeTruthy();
  });
});
