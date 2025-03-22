export interface Quote {
  id: string;
  text: string;
  author?: string;
  tags: string[];
  createdAt: number;
}

export interface QuoteStore {
  quotes: Quote[];
  tags: string[];
  forceQuotesInterface: boolean;
} 