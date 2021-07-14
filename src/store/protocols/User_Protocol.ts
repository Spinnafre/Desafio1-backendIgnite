import { Request } from "express";

export interface Users extends Request{
    user:User,
}
export interface User{
    id:string,
    name:string,
    username:string,
    todos:Array<Todo>
}
export interface Todo{
    id:string,
    title:string,
    done:boolean,
    deadline:Date,
    created_at:Date;
}