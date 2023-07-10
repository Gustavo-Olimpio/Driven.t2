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
    const authHeader = req.header('Authorization');
    const token = authHeader.split(' ')[1];
    try {
      const tickets = await getTicket(token.toString())
      return res.status(httpStatus.OK).send(tickets);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }
  export async function ticketsPost(req: Request, res: Response) {
    const authHeader = req.header('Authorization');
    const token = authHeader.split(' ')[1];
    const {ticketTypeId} = req.body
    try {
      const obj = await postTicket(token.toString(),parseInt(ticketTypeId))
      return res.status(httpStatus.CREATED).send(obj)
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }
  export async function paymentsGet(req: Request, res: Response) {
    const authHeader = req.header('Authorization');
    const token = authHeader.split(' ')[1];
    const {ticketId} = req.query
  
    try {
      const obj = await getPayments(token.toString(),Number(ticketId))
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
  export async function paymentsPost(req: Request, res: Response) {
    const authHeader = req.header('Authorization');
    const token = authHeader.split(' ')[1];
    const payment = req.body as Payment;
  
    try {
      const payments = await postPayment(token.toString(), payment)
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