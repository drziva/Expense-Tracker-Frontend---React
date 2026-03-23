export type LoginRequest = {
  email: string,
  password: string;
};

export type SignUpRequest = {
  email: string,
  password: string,
  username: string
}

export type LoginResponse = {
  user: {
    id: number,
    username: string,
    email: string,
    premium: boolean,
    notifications: boolean,
    welcomed: boolean
  }
};