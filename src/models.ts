export interface RequestBody {
  url: string
  itemSelector: string
  propertySelectors: PropertySelectors
}

export interface PropertySelectors {
  [property: string]: string | PropertySelector
}

export interface PropertySelector {
  selector: string
  attribute?: string
  regex?: string
}
