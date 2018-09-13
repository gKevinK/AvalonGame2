//#region Helpers

//#endregion

export class User
{
    id: string;
    name: string;
    roomid: string;
    token: string;
}

export default class UserManager
{
    users: Map<string, User>;
    tokenToUser: Map<string, string>;

    constructor () {
        this.users = new Map<string, User>();
    }

    private genId() {
        let id = "" + Math.floor((Math.random() * 9 + 1) * 100000);
        while (this.users.has(id))
            id = "" + Math.floor((Math.random() * 9 + 1) * 100000);
        return id;
    }

    private genToken() {
        return Math.random().toString(36).substring(2, 15)
             + Math.random().toString(36).substring(2, 15);
    }

    Register () : User {
        throw new Error("Method not implemented.");
    }

    Login () : string {
        throw new Error("Method not implemented.");
    }

    NewUser() : User {
        let user = new User();
        let id = this.genId();
        user.id = id;
        user.name = 'T' + id;
        this.users[id] = user;
        return user;
    }

    Get (userid: string) : User {
        if (! this.users.has(userid)) return undefined;
        return this.users[userid];
    }

    GetOrNew (token: string) : User {
        if (this.tokenToUser.has(token))
            return this.users[this.tokenToUser[token]];
        let user = this.NewUser();
        this.NewToken(user);
        return user;
    }

    NewToken (user: User) : string {
        if (user.token)
            this.tokenToUser.delete(user.token);
        let token = this.genToken();
        while (this.tokenToUser.has(token))
            token = this.genToken();
        user.token = token;
        this.tokenToUser[token] = user.id;
        return token;
    }

    Destroy (userid: string) {
        this.tokenToUser.delete(this.users[userid].token);
        this.users.delete(userid);
    }
}