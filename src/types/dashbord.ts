export interface DashboardData {
  total_books: number
  total_rentals: number
  total_users: number
  active_rentals: number
}

export interface DashbordApiResponse {
  data: DashboardData[]
}

export interface DashboarListResponse {
  results: DashboardData[]
  count?: number
  next?: string | null
  previous?: string | null
  resData?: string | null
}


export type DashboardApiResponseType = DashboardData[] | DashbordApiResponse | DashboarListResponse