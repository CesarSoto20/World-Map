import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { CountryInfo, CountryService } from '../country-service';

export interface CountryOption {
  code: string;
  name: string;
}

@Component({
  selector: 'app-map-comp',
  templateUrl: './map-comp.html',
  styleUrl: './map-comp.css',
})
export class MapComp implements AfterViewInit, OnDestroy {
  selectedCountry = '';
  selectedCountryName = '';
  hoveredCountryName = '';
  countryData: CountryInfo | null = null;
  isLoading = false;
  errorMessage = '';
  countryList: CountryOption[] = [];

  private selectedPathElement: Element | null = null;
  private countrySub?: Subscription;

  constructor(
    private readonly countryService: CountryService,
    private readonly elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.populateCountryList();
    }
  }

  private populateCountryList(): void {
    const paths = this.elementRef.nativeElement.querySelectorAll('svg path[id]');
    const list: CountryOption[] = [];
    paths.forEach((node) => {
      const code = node.id;
      const name = node.getAttribute('name') || code.toUpperCase();
      list.push({ code, name });
    });
    this.countryList = list.sort((a, b) => a.name.localeCompare(b.name));
  }

  onClick(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof Element) || target.tagName.toLowerCase() !== 'path') {
      return;
    }

    const code = target.id;
    const name = target.getAttribute('name') || code.toUpperCase();
    this.selectCountry(code, name, target);
  }

  onMouseOver(event: MouseEvent): void {
    const target = event.target;
    if (target instanceof Element && target.tagName.toLowerCase() === 'path') {
      this.hoveredCountryName = target.getAttribute('name') || target.id.toUpperCase();
    }
  }

  onMouseOut(event: MouseEvent): void {
    const target = event.target;
    if (target instanceof Element && target.tagName.toLowerCase() === 'path') {
      this.hoveredCountryName = '';
    }
  }

  onCountrySelectChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    const code = select?.value;
    if (!code) {
      return;
    }
    const country = this.countryList.find((c) => c.code.toLowerCase() === code.toLowerCase());
    this.selectCountry(code, country?.name);
  }

  selectCountry(code: string, name?: string, directElement?: Element): void {
    const normalizedCode = code.trim().toLowerCase();
    if (!normalizedCode) {
      return;
    }

    this.selectedCountry = normalizedCode;
    this.selectedCountryName = name || this.selectedCountryName || normalizedCode.toUpperCase();

    this.highlightPath(normalizedCode, directElement);
    this.getCountryDetail(normalizedCode);
  }

  private highlightPath(code: string, directElement?: Element): void {
    if (this.selectedPathElement) {
      this.selectedPathElement.classList.remove('selected');
      this.selectedPathElement = null;
    }

    const host = this.elementRef.nativeElement;
    host.querySelector('svg path.selected')?.classList.remove('selected');

    const target = directElement ?? host.querySelector(`svg path#${code}`);
    if (target) {
      target.classList.add('selected');
      this.selectedPathElement = target;
    }
  }

  getCountryDetail(code: string): void {
    if (!code) {
      return;
    }

    this.countrySub?.unsubscribe();
    this.isLoading = true;
    this.errorMessage = '';
    this.countryData = null;

    this.countrySub = this.countryService.getCountryData(code).subscribe({
      next: (data) => {
        this.isLoading = false;
        const country = Array.isArray(data) && Array.isArray(data[1]) ? data[1][0] : undefined;

        if (country) {
          this.countryData = country;
          if (!this.selectedCountryName && country.name) {
            this.selectedCountryName = country.name;
          }
        } else {
          const label = this.selectedCountryName || code.toUpperCase();
          this.errorMessage = `No World Bank data available for ${label}.`;
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load country information. Please try again.';
      },
    });
  }

  ngOnDestroy(): void {
    this.countrySub?.unsubscribe();
  }
}

