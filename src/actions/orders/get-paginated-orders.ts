'use server'
import { auth } from '../../../auth.config'
import prisma from '@/lib/prisma'

export const getPaginatedOrders = async () => {
  const session = await auth()

  if (session?.user.role !== 'admin') {
    return {
      ok: false,
      message: 'Debe de estar autenticado',
    }
  }

  console.log(session?.user.id)

  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      OrderAddress: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  })

  console.log(orders)

  return {
    ok: true,
    orders: orders,
  }
}
