import { notFoundError } from "@/errors";
import paymentRepository from "@/repositories/payment-repository";
import { Payment } from "@/protocols";

export async function getTicketType() {
    const tickets = await paymentRepository.getTicketsType();
    return tickets
}

export async function getTicket(token:string) {
    const tickets = await paymentRepository.getTickets(token);
    if(!tickets){
        throw notFoundError();
    }
    return tickets
}

export async function postTicket(token:string,ticketTypeId:number) {
    if (!ticketTypeId){
        throw "error"
    }
    const obj = await paymentRepository.postTickets(token,ticketTypeId);
    return obj
}
export async function getPayments(token:string,ticketId:number) {
    if (!ticketId){
        throw "error"
    }
    const obj = await paymentRepository.getPayments(token,ticketId);
    return obj
}

export async function postPayment(token: string, payment: Payment){
    const tickets = await paymentRepository.getTickets(token);
    if(!tickets){
        throw notFoundError();
    };
    return await paymentRepository.createPayment(payment);
};