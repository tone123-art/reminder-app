export type User = {
    id: number,
    email:string,
    username:string,
    role:string,
}

export type LoaderData = { users: User[] };