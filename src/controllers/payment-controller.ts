import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { getTicketType,getTicket,postTicket,getPayments,postPayment } from '@/services/payment-service';
import { Payment } from '@/protocols';
import { AuthenticatedRequest } from '@/middlewares';

export async function ticketstypeGet(req: Request, res: Response) {
    try {
        const ticketsType = await getTicketType()
        return res.status(httpStatus.OK).send(ticketsType);
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }
  export async function ticketsGet(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    try {
      const tickets = await getTicket(Number(userId))
      return res.status(httpStatus.OK).send(tickets);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }
  export async function ticketsPost(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const {ticketTypeId} = req.body
    try {
      const obj = await postTicket(Number(userId),parseInt(ticketTypeId))
      return res.status(httpStatus.CREATED).send(obj)
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }
  export async function paymentsGet(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const {ticketId} = req.query
  
    try {
      const obj = await getPayments(Number(userId),Number(ticketId))
      return res.status(httpStatus.OK).send(obj)
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
      if (error.name === 'UnauthorizedError') {
        return res.sendStatus(httpStatus.UNAUTHORIZED);
      }
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }
  export async function paymentsPost(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const payment = req.body as Payment;
    
    try {
      const payments = await postPayment(Number(userId), payment)
      return res.status(httpStatus.OK).send(payments);


    } catch (error) {
      if (error.name === "NotFoundError") {
        return res.status(httpStatus.NOT_FOUND).send(error)
    }
    if (error.name === "UnauthorizedError") {
        return res.status(httpStatus.UNAUTHORIZED).send(error)
    }
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }