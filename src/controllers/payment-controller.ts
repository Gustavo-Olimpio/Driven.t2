import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { getTicketType,getTicket,postTicket,getPayments,postPayment } from '@/services/payment-service';
import { Payment } from '@/protocols';

export async function ticketstypeGet(req: Request, res: Response) {
    try {
        const ticketsType = await getTicketType()
        return res.status(httpStatus.OK).send(ticketsType);
    } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }
  export async function ticketsGet(req: Request, res: Response) {
    const {authorization} = req.headers
    try {
      const tickets = await getTicket(authorization.toString())
      return res.status(httpStatus.OK).send(tickets);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }
  export async function ticketsPost(req: Request, res: Response) {
    const {authorization} = req.headers
    const {ticketTypeId} = req.body
    try {
      const obj = await postTicket(authorization.toString(),parseInt(ticketTypeId))
      res.status(httpStatus.CREATED).send(obj)
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }
  export async function paymentsGet(req: Request, res: Response) {
    const {authorization} = req.headers
    const {ticketId} = req.query
  
    try {
      const obj = await getPayments(authorization.toString(),Number(ticketId))
      res.status(httpStatus.OK).send(obj)
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
  export async function paymentsPost(req: Request, res: Response) {
    const { authorization } = req.headers;
    const payment = req.body as Payment;
  
    try {
      const payments = await postPayment(authorization.toString(), payment)
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