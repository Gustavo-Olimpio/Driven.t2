import { Router } from "express";
import { ticketstypeGet,ticketsGet, ticketsPost,paymentsGet,paymentsPost } from "@/controllers";
//import { authenticateToken } from "@/middlewares";
const paymentRouter = Router();

//paymentRouter.all("/*", authenticateToken)
paymentRouter.get('/tickets/types',ticketstypeGet)
paymentRouter.get('/tickets',ticketsGet)
paymentRouter.post('/tickets',ticketsPost)
paymentRouter.get('/payments',paymentsGet)
paymentRouter.post('/payments/process',paymentsPost)

export {paymentRouter};