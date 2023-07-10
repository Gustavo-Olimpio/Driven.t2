import { prisma } from '@/config';
import { notFoundError,unauthorizedError } from '@/errors';
import { Payment } from '@/protocols';
async function getTicketsType() {
    return prisma.ticketType.findMany();
  }

async function getTickets(token:string) {
    const user = await prisma.session.findFirst({
    where:{
      token:token
    }
    })
    if(!user){
      throw notFoundError();
    }
    const enrollment = await prisma.enrollment.findFirst({
      where:{
        userId:user.id
      }
      })

    return prisma.ticket.findFirst({
      where:{
        enrollmentId:enrollment.id
      }
      });
  }

  async function postTickets(token:string,ticketTypeId:number) {
    const user = await prisma.session.findFirst({
      where:{
        token:token
      }
      })
      if (!user){
        throw notFoundError();
      }
    const id = user.userId
    const enrollment = await prisma.enrollment.findFirst({
      where:{
        userId:id
      }
      })
      const ticketType = await prisma.ticketType.findFirst({
        where:{
          id:ticketTypeId
        }
        })
      await prisma.ticket.create({
        data: {
          ticketTypeId:ticketTypeId,
          enrollmentId:enrollment.id,
          status:"RESERVED"
        }
      })
      const ticket = await prisma.ticket.findFirst({
        where:{
          enrollmentId:enrollment.id
        }
        })
      const obj = {
        id: ticket.id,
        status: ticket.status, 
        ticketTypeId: ticketTypeId,
        enrollmentId: enrollment.id,
        TicketType: {
          id: ticketType.id,
          name: ticketType.name,
          price: ticketType.price,
          isRemote: ticketType.isRemote,
          includesHotel: ticketType.includesHotel,
          createdAt: ticketType.createdAt,
          updatedAt: ticketType.updatedAt,
        },
        createdAt:ticket.createdAt,
        updatedAt: ticket.updatedAt
      }
    return obj
  }

  async function getPayments(token:string,ticketId:number) {
    const user = await prisma.session.findFirst({
      where:{
        token:token
      }
      })
      const ticket = await prisma.ticket.findFirst({
        where:{
          id:ticketId
        }
        })
        const enrollment = await prisma.enrollment.findFirst({
          where:{
            id:ticket.enrollmentId
          }
          })
        if(user.id !== enrollment.userId){
          throw unauthorizedError();
        }
   
  const payment = await prisma.payment.findFirst({
      where:{
        ticketId:ticketId
      }
    });
    if (!payment){
      throw notFoundError();
    }
    return payment
  }
  async function createPayment(payment: Payment) {
    const ticket = await prisma.ticket.findFirst({
        where: {
            id: payment.ticketId
        },
        include: {
            TicketType: {
                select: {
                    price: true
                }
            }
        }
    });
    const ticketIdExists = await prisma.payment.findFirst({
        where: { ticketId: payment.ticketId }
    })

    if (!ticketIdExists){
        throw notFoundError();
    }

    const numbers = payment.cardData.number.toString();
    const lastDigits = numbers[12] + numbers[13] + numbers[14] + numbers[15]
    const pay = await prisma.payment.create({
        data: {
            ticketId: payment.ticketId,
            cardIssuer: payment.cardData.issuer, 
            cardLastDigits: lastDigits,
            value: ticket.TicketType.price
        }
    })
    return pay;
}
  const paymentRepository = {
    getTicketsType, getTickets,postTickets, getPayments, createPayment,
  };
  
  export default paymentRepository;