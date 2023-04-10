export default class UserDTO {
    constructor({ username, password }) {
        this.username = username
        this.password = password
    }
}

export function transformToDTO(users) {
    if (Array.isArray(users)) {
        return users.map(u => new UserDTO(u))
    } else {
        return new UserDTO(users)
    }
}