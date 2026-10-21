import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CountryService, WorldBankCountryResponse } from './country-service';

describe('CountryService', () => {
  let service: CountryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CountryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch country data from the World Bank API', () => {
    const mockResponse: WorldBankCountryResponse = [
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

    service.getCountryData('US').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://api.worldbank.org/v2/country/us?format=json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return cached data on subsequent calls without making extra HTTP requests', () => {
    const mockResponse: WorldBankCountryResponse = [
      { page: 1, pages: 1, per_page: '50', total: 1 },
      [
        {
          id: 'CAN',
          iso2Code: 'CA',
          name: 'Canada',
          region: { id: 'NAC', iso2code: 'XU', value: 'North America' },
          adminregion: { id: '', iso2code: '', value: '' },
          incomeLevel: { id: 'HIC', iso2code: 'XD', value: 'High income' },
          lendingType: { id: 'LNX', iso2code: 'XX', value: 'Not classified' },
          capitalCity: 'Ottawa',
          longitude: '-75.6919',
          latitude: '45.4215',
        },
      ],
    ];

    let firstResult: WorldBankCountryResponse | undefined;
    service.getCountryData('CA').subscribe((res) => (firstResult = res));

    const req = httpMock.expectOne('https://api.worldbank.org/v2/country/ca?format=json');
    req.flush(mockResponse);
    expect(firstResult).toEqual(mockResponse);

    // Second call for the same country code should use cache, not HTTP
    let cachedResult: WorldBankCountryResponse | undefined;
    service.getCountryData('CA').subscribe((res) => (cachedResult = res));
    httpMock.expectNone('https://api.worldbank.org/v2/country/ca?format=json');
    expect(cachedResult).toEqual(mockResponse);
  });
});

