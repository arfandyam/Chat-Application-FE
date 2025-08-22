import type { User } from "../types/domain/user";
import type { AddUserResponse, GetAllUserResponse } from "../types/response/user";

export const addUserApi = async (username: string): Promise<User> => {
    // Logic to add user
    const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    });

    const user: AddUserResponse = await response.json();
    return user.data;
}

export const getAllUsersApi = async (): Promise<User[]> => {
    const response = await fetch('http://localhost:8080/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const users: GetAllUserResponse = await response.json();
    return users.data;
}

export const getFriendsUserApi = async (userId: string): Promise<User[]> => {
    const response = await fetch(`http://localhost:8080/user/${userId}/friends`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const friends: GetAllUserResponse = await response.json();
    return friends.data;
}
