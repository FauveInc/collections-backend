import express from "express";

export interface ILooseObject {
    [key: string]: any;
}

interface IAuth0User {
    iss: string;
    sub: string;
    aud: [string];
    iat: number;
    exp: number;
    azp: string;
    scope: string;
}

export interface IRequest extends express.Request {
    user: IAuth0User;
}
