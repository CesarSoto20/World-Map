import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

export interface WorldBankValue {
  id: string;
  iso2code: string;
  value: string;
}

export interface CountryInfo {
  id: string;
  iso2Code: string;
  name: string;
  region: WorldBankValue;
  adminregion: WorldBankValue;
  incomeLevel: WorldBankValue;
  lendingType: WorldBankValue;
  capitalCity: string;
  longitude: string;
  latitude: string;
}

export interface WorldBankPaginationMeta {
  page: number;
  pages: number;
  per_page: string;
  total: number;
}

export interface WorldBankErrorMessage {
  id: string;
  key: string;
  value: string;
}

export interface WorldBankErrorResponse {
  message: WorldBankErrorMessage[];
}

export type WorldBankCountryResponse =
  | [WorldBankPaginationMeta, CountryInfo[]?]
  | [WorldBankErrorResponse];

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private readonly baseUrl = 'https://api.worldbank.org/v2/country/';
  private readonly cache = new Map<string, WorldBankCountryResponse>();

  constructor(private readonly http: HttpClient) {}

  getCountryData(code: string): Observable<WorldBankCountryResponse> {
    const normalizedCode = encodeURIComponent(code.trim().toLowerCase());

    if (this.cache.has(normalizedCode)) {
      return of(this.cache.get(normalizedCode)!);
    }

    const url = `${this.baseUrl}${normalizedCode}?format=json`;
    return this.http.get<WorldBankCountryResponse>(url).pipe(
      tap((response) => {
        this.cache.set(normalizedCode, response);
      }),
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}

