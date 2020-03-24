import { AppComponent } from './app.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';

import { LicenseManager } from 'ag-grid-enterprise';
import { LICENSE_KEY } from './license-key.js';

describe('Component AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

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
  });

  it('should set the license key', () => {
    spyOn(LicenseManager, 'setLicenseKey');

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(LicenseManager.setLicenseKey).toHaveBeenCalledWith(LICENSE_KEY);
  });

  it('should NOT print error messages to the console', () => {
    spyOn(window.console, 'error');

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(window.console.error).not.toHaveBeenCalled();
  });

});
