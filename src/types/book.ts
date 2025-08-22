// src/types/book.ts
export interface Typebook {
  id: number
  title: string
  author: string
  stock: number
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

// เพิ่ม types อื่นๆ ที่เกี่ยวข้องกับ book ได้
export interface CreateBookRequest {
  title: string
  author: string
  stock: number
}

export interface UpdateBookRequest {
  id: number
  title?: string
  author?: string
  stock?: number
}

// Type สำหรับ Axios Response
export type BookApiResponseType = Typebook[] | BookApiResponse | BookListResponse