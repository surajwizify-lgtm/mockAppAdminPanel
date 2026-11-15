export type User = {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: 'ADMIN' | 'USER';
    password: string
}

export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T
}

export type Role = 'ADMIN' | 'USER'