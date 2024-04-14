'use server';

import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

import prisma from '@/lib/prisma';
import { revalidatePath } from "next/cache";


export const deleteProductImage = async ( imageId:number, imageUrl:string) => {

    if(!imageUrl.startsWith('http')){
        return {
            ok:false,
            error:'No se puede borrar imagenes de fs'
        }
    }

    const imageName = imageUrl.split('/').pop()?.split('.')[0] ?? '';

    console.log({imageName});

    try {

        await cloudinary.uploader.destroy(imageName);
        const deletedProductImage = await prisma?.productImage.delete({
            where:{
                id:imageId
            },
            select:{
                product:{
                    select:{
                        slug:true
                    }
                }
            }
        })


        revalidatePath(`/admin/products`)
        revalidatePath(`/admin/products/${deletedProductImage.product.slug}`);
        revalidatePath(`/product/${deletedProductImage.product.slug}`)
        
    } catch (error) {
        console.log(error)
        return {
            ok:false,
            message:'No se pudo eliminar la imagen'
        };
    }

}