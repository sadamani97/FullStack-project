import { Request, Response, NextFunction } from "express";
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
declare const authmiddleware: (req: Request, res: Response, next: NextFunction) => void;
export default authmiddleware;
//# sourceMappingURL=authmiddleware.d.ts.map