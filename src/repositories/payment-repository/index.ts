import { prisma } from '@/config';
import { notFoundError,unauthorizedError } from '@/errors';
import { Payment } from '@/protocols';
async function getTicketsType() {
    return prisma.ticketType.findMany();
  }

async function getTickets(userId:number) {
    const user = await prisma.user.findFirst({
    where:{
      id:userId
    }
    })
    
    if(!user){
      throw notFoundError();
    }
    const enrollment = await prisma.enrollment.findFirst({
      where:{
        userId:userId
      }
      })
    if(!enrollment){
        throw notFoundError();
    }

    const ticket = await prisma.ticket.findFirst({
      where:{
        enrollmentId:enrollment.id
      }
      });
      if(!ticket){
        throw notFoundError();
    }
      const ticketType = await prisma.ticketType.findFirst({
        where:{
          id:ticket.ticketTypeId
        }
        });

      const obj = {
        id: ticket.id,
        status: ticket.status, 
        ticketTypeId: ticket.ticketTypeId,
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

  async function postTickets(userId:number,ticketTypeId:number) {
  
    const enrollment = await prisma.enrollment.findFirst({
      where:{
        userId:userId
      }
      })
      if (!enrollment){
       throw notFoundError();
      }
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

  async function getPayments(userId:number,ticketId:number) {
      const ticket = await prisma.ticket.findFirst({
        where:{
          id:ticketId
        }
        })
        if (!ticket){
          
          throw notFoundError();
        }
        const enrollment = await prisma.enrollment.findFirst({
          where:{
            id:ticket.enrollmentId
          }
          })
        if(userId !== enrollment.userId){
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
  async function createPayment(payment: Payment,userId:number) {
    const enrollment = await prisma.enrollment.findFirst({
      where:{
        userId:userId
      }
    })
    
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
 
    if(!ticket){
      throw notFoundError();
    }
    if(enrollment.id !== ticket.enrollmentId){
        throw unauthorizedError();
    }
    const ticketIdExists = await prisma.payment.findFirst({
        where: { ticketId: payment.ticketId }
    })

    const numbers = payment.cardData.number.toString();
    const lastDigits = numbers[11] + numbers[12] + numbers[13] + numbers[14]
    const pay = await prisma.payment.create({
        data: {
            ticketId: payment.ticketId,
            cardIssuer: payment.cardData.issuer, 
            cardLastDigits: lastDigits,
            value: ticket.TicketType.price
        }
    })
    await prisma.ticket.update({
      where:{
        id:payment.ticketId
      },
      data:{
        status:"PAID"
      }
    });
    return pay;
}
  const paymentRepository = {
    getTicketsType, getTickets,postTickets, getPayments, createPayment,
  };
  
  export default paymentRepository;