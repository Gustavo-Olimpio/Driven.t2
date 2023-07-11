import { notFoundError,unauthorizedError } from "@/errors";
import paymentRepository from "@/repositories/payment-repository";
import { Payment } from "@/protocols";

export async function getTicketType() {
    const tickets = await paymentRepository.getTicketsType();
    return tickets
}

export async function getTicket(userId:number) {
    const tickets = await paymentRepository.getTickets(userId);
    if(!tickets){
        throw notFoundError();
    }
    return tickets
}

export async function postTicket(userId:number,ticketTypeId:number) {
    if (!ticketTypeId){
        throw "error"
    }
    const obj = await paymentRepository.postTickets(userId,ticketTypeId);
    return obj
}
export async function getPayments(userId:number,ticketId:number) {
    if (!ticketId){
        throw "error"
    }
    const obj = await paymentRepository.getPayments(userId,ticketId);
    return obj
}

export async function postPayment(userId:number, payment: Payment){
    if(!payment.ticketId || !payment.cardData){
        throw "error"
    }
  
    return await paymentRepository.createPayment(payment,userId);
};