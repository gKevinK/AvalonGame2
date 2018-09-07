export class User
{
    id: string;
    name: string;
    cookie: string;
}

export default class UserManager
{
    users: Map<string, User>;

    constructor () {
        this.users = new Map<string, User>();
    }
}