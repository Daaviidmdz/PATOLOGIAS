import { MASTER_CATALOG } from '../constants';
import { Pathology, System } from '../types';

const CATALOG_KEY = 'nursing_catalog';
const LATEST_ITEMS_COUNT = 5;

class CatalogService {
  private masterCatalog: Pathology[] = MASTER_CATALOG;
  private currentCatalog: Pathology[] = [];

  constructor() {
    // The initialization is now fully handled by the async initializeCatalog method
  }

  public initializeCatalog(): Promise<void> {
    return new Promise(resolve => {
        // To solve the issue of new pathologies not showing up, we will now always
        // load the full master catalog from the code. This ensures that any new
        // pathologies added by the developer are immediately visible in the app.
        const storedCatalog = localStorage.getItem(CATALOG_KEY);
        if (storedCatalog) {
            this.currentCatalog = JSON.parse(storedCatalog);
        } else {
            this.currentCatalog = [...this.masterCatalog]; // Use a copy to avoid mutation
            localStorage.setItem(CATALOG_KEY, JSON.stringify(this.currentCatalog));
        }
        resolve();
    });
  }
  
  private loadCatalogFromStorage() {
      const storedCatalog = localStorage.getItem(CATALOG_KEY);
      if (storedCatalog) {
          this.currentCatalog = JSON.parse(storedCatalog);
      } else {
          // If nothing is in storage, initialize with the full catalog.
          this.currentCatalog = this.masterCatalog;
      }
  }

  public getCatalog(): Pathology[] {
    // Ensure catalog is loaded if it hasn't been initialized yet
    if (this.currentCatalog.length === 0) {
        this.loadCatalogFromStorage();
    }
    return this.currentCatalog;
  }

  public addPathology(pathology: Pathology) {
    const catalog = this.getCatalog();
    // Avoid adding duplicates if for some reason it's generated again
    if (!catalog.find(p => p.id === pathology.id)) {
        this.currentCatalog.push(pathology);
        localStorage.setItem(CATALOG_KEY, JSON.stringify(this.currentCatalog));
    }
  }

  public searchPathologies(query: string): Pathology[] {
    const lowerQuery = query.toLowerCase();
    return this.getCatalog().filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.sintomatologia.some(s => s.toLowerCase().includes(lowerQuery)) ||
      p.clavesResumen.toLowerCase().includes(lowerQuery)
    );
  }

  public getPathologiesBySystem(system: System): Pathology[] {
    return this.getCatalog().filter(p => p.sistema === system);
  }

  public getLatest(): Pathology[] {
    // Returns the last items added to the master list.
    const catalog = this.getCatalog();
    return catalog.slice(-LATEST_ITEMS_COUNT);
  }
}

export const catalogService = new CatalogService();