export type User = {
  email: string
  phone?: string
  provider: string
  created: string
  lastSignIn?: string
  uuid: string
}

export type UserAccountType = {
  username?: string
  website?: string
  avatar_url?: string
}
