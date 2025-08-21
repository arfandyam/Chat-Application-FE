import type { AddUserResponse } from "../types/response/user";

export const AddUser = async (username: string): Promise<AddUserResponse> => {
    // Logic to add user
    const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    });

    const user: AddUserResponse = await response.json();
    return user;
}
