// src/types/book.ts
export interface Typebook {
  id: number
  title: string
  author: string
  stock: number
  available_count: number
}

// API Response types
export interface BookApiResponse {
  data: Typebook[]
}

// อาจจะมี response แบบอื่นด้วย
export interface BookListResponse {
  results: Typebook[]
  count?: number
  next?: string | null
  previous?: string | null
  resData?: string | null
}



// Type สำหรับ Axios Response
export type BookApiResponseType = Typebook[] | BookApiResponse | BookListResponse