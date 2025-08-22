export interface ResponseJson<T> {
    status: string;
    message: string;
    data: T;
}