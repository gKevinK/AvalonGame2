//#region Helpers

//#endregion

export interface IUser
{
    id: string;
    name: string;
    roomid?: string;
    token: string;
}

export default class UserManager
{
    private users: Map<string, IUser>;
    private tokenToUser: Map<string, string>;

    constructor () {
        this.users = new Map();
        this.tokenToUser = new Map();
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

    Register () : IUser {
        throw new Error("Method not implemented.");
    }

    Login () : string {
        throw new Error("Method not implemented.");
    }

    NewUser (name?: string) : IUser {
        let id = this.genId();
        let user = <IUser>{ id: id, name: (name ? name : 'T' + id) };
        this.users.set(id, user);
        return user;
    }

    Get (userid: string) : IUser | undefined {
        return this.users.get(userid);
    }

    GetByToken (token: string) : IUser | undefined {
        if (!this.tokenToUser.has(token)) return undefined;
        return this.users.get(this.tokenToUser.get(token) as string);
    }

    NewToken (user: IUser) : string {
        if (user.token)
            this.tokenToUser.delete(user.token);
        let token = this.genToken();
        while (this.tokenToUser.has(token))
            token = this.genToken();
        user.token = token;
        this.tokenToUser.set(token, user.id);
        return token;
    }

    Destroy (userid: string) {
        let u = this.users.get(userid);
        if (!u) return;
        this.tokenToUser.delete(u.token);
        this.users.delete(userid);
    }
}