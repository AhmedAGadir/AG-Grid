import { AppComponent } from './app.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';

import { LicenseManager } from 'ag-grid-enterprise';

describe('Component AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  const LICENSE_KEY = 'YOUR_KEY';

  const INVALID_LICENSE_ERROR_MESSAGES = [
    '****************************************************************************************************************',
    '***************************************** ag-Grid Enterprise License *******************************************',
    '****************************************** License Key Not Found ***********************************************',
    '* All ag-Grid Enterprise features are unlocked.                                                                *',
    '* This is an evaluation only version, it is not licensed for development projects intended for production.     *',
    '* If you want to hide the watermark, please email info@ag-grid.com for a trial license.                        *',
    '****************************************************************************************************************',
    '****************************************************************************************************************'
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        BrowserModule,
        HttpClientModule,
        AgGridModule.withComponents([])
      ],
      providers: []
    });

    spyOn(window.console, 'error');

  });

  it('should print error messages to console', () => {
    LicenseManager.setLicenseKey(null);

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    INVALID_LICENSE_ERROR_MESSAGES.forEach(errorMessage => {
      expect(window.console.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('should NOT print error messages to the console', () => {
    LicenseManager.setLicenseKey(LICENSE_KEY);

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(window.console.error).not.toHaveBeenCalled();
  });

});
