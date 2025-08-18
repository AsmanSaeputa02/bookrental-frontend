

export type AdminLoginResponse = {
  access: string
  refresh?: string
  user?: {
    email: string
    role: string
  }
}
