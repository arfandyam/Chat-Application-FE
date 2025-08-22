import type { User } from "../domain/user";
import type { ResponseJson } from "./response";

export type AddUserResponse = ResponseJson<User>;
export type GetAllUserResponse = ResponseJson<User[]>;

// export interface AddUserResponse extends ResponseJson {
//     id: string;
//     username: string;
// }