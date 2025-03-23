export interface Quote {
  id: string;
  text: string;
  author?: string;
  tags: string[];
  createdAt: number;
  updatedAt?: number;
  userId?: string;
}

export interface QuoteStore {
  quotes: Quote[];
  tags: string[];
  forceQuotesInterface: boolean;
} 