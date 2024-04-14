'use server';
import prisma from '@/lib/prisma';
import { auth } from '../../../auth.config';

export const getOrderById = async (id:string) => {

    const session = await auth();

    if(!session?.user) {
        return {
            ok:false,
            message:'Debe de estar autenticado'
        }
    }

    try {

        const order = await prisma.order.findUnique({
            where:{
                id:id
            }
        });

        const OrderAddress = await prisma.orderAddress.findFirst({
            where:{
                orderId:id
            }
        })
    
        const orderItems =  await prisma.orderItem.findMany({
            where:{
                orderId:id,
            },
            select:{
                price:true,
                quantity:true,
                size:true,
                product:{
                    select:{
                        title:true,
                        slug:true,

                        ProductImage:{
                            select:{
                                url:true
                            },
                            take:1
                        }
                    }
                }
            }
        })

        if(!order){
            throw `${id} no existe`
        }

        if(session.user.role === 'user'){
            if(session.user.id !== order.userId){
                throw `${id} no pertenece a este usuario`  
            }
        }

        return {
            ok:true,
            order:order,
            orderAddress:OrderAddress,
            orderItems:orderItems
        }
        
    } catch (error) {
        console.log(error);
        return {
            ok:false,
            message:'Orden no existe'

        }
    }






}