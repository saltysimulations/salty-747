import { CJ4_FMC_Page } from "./CJ4_FMC_Page";

/** A class for managing and showing navigation between FMC pages */
export class CJ4_FMC_NavigationService {
  private _currentPage: CJ4_FMC_Page;

  constructor(private _fmc: CJ4_FMC) { }

  /** Constructs and shows a page given the type as argument */
  public showPage<T extends CJ4_FMC_Page>(page: new (fmc: CJ4_FMC, ...args: any[]) => T, ...args: any[]): void {
    this._fmc.clearDisplay();
    this._currentPage = new page(this._fmc, ...args);
    this._currentPage.updateCheck();

    if (this._currentPage.hasRefresh()) {
      this.registerRefresh();
    }
  }

  /** Registers the refresh loop  */
  private registerRefresh() {
    // register refresh and bind to update which will only render on changes
    this._fmc.registerPeriodicPageRefresh(() => {
      this._currentPage.updateCheck();
      this.registerRefresh();
      return true;
    }, this._currentPage.refreshInterval, false);
  }
}