import { NextFunction, Request, Response } from "express";

export default function error(err: any, req: Request, res: Response, next: NextFunction) {
    if (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

