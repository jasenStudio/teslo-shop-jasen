'use server'

import prisma from '@/lib/prisma';
// import { sleep } from '@/utils';


export const getStockBySlug = async (slug:string) => {

    
    try {
        // sleep(3);

        const stock = await prisma.product.findFirst({
               where:{
                   slug:slug
               },
               select:{
                inStock:true
               }
        })
       
         return stock?.inStock ?? 0;
            
        } catch (error) {   
            return 0;
        }
}