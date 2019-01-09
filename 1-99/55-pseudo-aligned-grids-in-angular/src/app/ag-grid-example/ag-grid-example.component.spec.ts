import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridExampleComponent } from './ag-grid-example.component';

describe('AgGridExampleComponent', () => {
  let component: AgGridExampleComponent;
  let fixture: ComponentFixture<AgGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
