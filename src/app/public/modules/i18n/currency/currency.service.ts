import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Currency service
 */
@Injectable({
  providedIn: 'root'
})
export class SkyCurrencyService {
  private _currencies$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['USD']);
  private _currency$: BehaviorSubject<string> = new BehaviorSubject<string>('USD');

  /** Stream of the available currencies. */
  public get currencies$(): Observable<string[]> {
    return this._currencies$.asObservable();
  }

  /** Stream of the current currency. */
  public get currency$(): Observable<string> {
    return this._currency$.asObservable();
  }

  /** The current currency. */
  public getCurrency(): string {
    return this._currency$.value;
  }

  /** The available currencies. */
  public getCurrencies(): string[] {
    return this._currencies$.value;
  }

  /**
   * Sets the currency only if the currency is compatible with the environment.
   * @param isoCode the currency code
   */
  public setCurrency(isoCode: string): void {
    const currencies: string[] = this.getCurrencies();

    if (currencies.findIndex(c => c === isoCode) >= 0) {
      this._currency$.next(isoCode);
    } else {
      throw `${isoCode} is not available in the list of [${currencies}]`;
    }
  }

  /**
   * Sets the available currencies.
   * @param isoCode the currency code
   */
  public setCurrencies(isoCodes: string[]): void {
    this._currencies$.next(isoCodes);
  }

}
