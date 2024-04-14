'use server'

import prisma from '@/lib/prisma';

export const setTransactionsId = async (orderId:string,transactionId:string) => {

try {

  const order = await prisma.order.findUnique({
    where:{
      id:orderId
    }
  })

  if(!order){
    return {
      ok:false,
      message:`No existe una orden con el id ${orderId}`
    }
  }

  const orderUpdate = await prisma.order.update({
    where:{
      id:orderId
    },
    data:{
      transactionId:transactionId
    }
  })
    
    
  return {
      ok:true,
      order:orderUpdate
  }
  
} catch (error) {
  console.log(error);

  throw new Error('Error al realizar esta actualización')
}
  
}
