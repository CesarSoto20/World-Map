import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { MapComp } from './map-comp';
import { CountryService, WorldBankCountryResponse } from '../country-service';

describe('MapComp', () => {
  let component: MapComp;
  let fixture: ComponentFixture<MapComp>;
  let countryService: CountryService;

  const mockUsResponse: WorldBankCountryResponse = [
    { page: 1, pages: 1, per_page: '50', total: 1 },
    [
      {
        id: 'USA',
        iso2Code: 'US',
        name: 'United States',
        region: { id: 'NAC', iso2code: 'XU', value: 'North America' },
        adminregion: { id: '', iso2code: '', value: '' },
        incomeLevel: { id: 'HIC', iso2code: 'XD', value: 'High income' },
        lendingType: { id: 'LNX', iso2code: 'XX', value: 'Not classified' },
        capitalCity: 'Washington D.C.',
        longitude: '-77.032',
        latitude: '38.8895',
      },
    ],
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapComp],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MapComp);
    component = fixture.componentInstance;
    countryService = TestBed.inject(CountryService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select a country path on click and display its details', () => {
    spyOn(countryService, 'getCountryData').and.returnValue(of(mockUsResponse));

    const usPath = fixture.nativeElement.querySelector('path#us') as SVGPathElement;
    expect(usPath).not.toBeNull();

    usPath.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(usPath.classList.contains('selected')).toBeTrue();
    expect(component.selectedCountry).toBe('us');
    expect(component.countryData?.name).toBe('United States');
    expect(fixture.nativeElement.textContent).toContain('Washington D.C.');
  });

  it('should display an error message when the API request fails', () => {
    spyOn(countryService, 'getCountryData').and.returnValue(
      throwError(() => new Error('Network error')),
    );

    component.getCountryDetail('us');
    fixture.detectChanges();

    expect(component.countryData).toBeNull();
    expect(component.errorMessage).toContain('Unable to load country information');
  });

  it('should update hoveredCountryName on mouseover and clear on mouseout', () => {
    const usPath = fixture.nativeElement.querySelector('path#us') as SVGPathElement;
    expect(usPath).not.toBeNull();

    usPath.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    fixture.detectChanges();
    expect(component.hoveredCountryName).toBe('United States');

    usPath.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    fixture.detectChanges();
    expect(component.hoveredCountryName).toBe('');
  });

  it('should select country programmatically and via dropdown selection', () => {
    spyOn(countryService, 'getCountryData').and.returnValue(of(mockUsResponse));

    component.selectCountry('us', 'United States');
    fixture.detectChanges();

    const usPath = fixture.nativeElement.querySelector('path#us') as SVGPathElement;
    expect(usPath.classList.contains('selected')).toBeTrue();
    expect(component.selectedCountry).toBe('us');
    expect(component.countryData?.name).toBe('United States');
  });

  it('should display a friendly message when World Bank returns no data for a territory', () => {
    spyOn(countryService, 'getCountryData').and.returnValue(
      of([{ page: 1, pages: 0, per_page: '50', total: 0 }]),
    );

    component.selectCountry('ai', 'Anguilla');
    fixture.detectChanges();

    expect(component.countryData).toBeNull();
    expect(component.errorMessage).toContain('No World Bank data available for Anguilla.');
  });
});

