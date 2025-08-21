import type { ResponseJson } from "./response";

export interface AddUserResponse extends ResponseJson {
    id: string;
    username: string;
}