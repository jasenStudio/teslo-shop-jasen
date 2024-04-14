import { initialData } from "./seed";
import prisma from '../lib/prisma';
import { Size } from '../interfaces/product.interface';
import { countries } from './seed-country';

async function main(){
//1.registrar registro previos

    await prisma.orderAddress.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();

    await prisma.userAddress.deleteMany();
    await prisma.user.deleteMany();
    await prisma.country.deleteMany();


    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();


    const {categories, products,users } = initialData;
    const countriesData = countries

    await prisma.user.createMany({
        data:users
    })

    await prisma.country.createMany({
        data:countriesData
    })

    const categoriesData = categories.map( category => ({
        name:category
    }))

    await prisma.category.createMany({
        data:categoriesData
    })

    const categoriesDB = await prisma.category.findMany();

    const categoriesMap = categoriesDB.reduce( (map,category) => {
    map[category.name.toLowerCase()] = category.id
        return map
    }, {} as Record<string,string>)

    ///Products
    products.forEach( async (product) => {

        const {type,images,...rest} = product;
        const dbProduct = await prisma.product.create({
            data:{
                ...rest,
                categoryId:categoriesMap[type]
            }
        })


        const imagesData = images.map( image => ({
            url:image,
            productId:dbProduct.id
        }))

        await prisma.productImage.createMany({
            data:imagesData
        });


    });



    // const {images,...product1} = products[0];

    // await prisma.product.create({
    //     data:{
    //         ...product1,
    //         categoryId:categoriesMap['shirts']
    //     }
    // })


}




(() => {
    if (process.env.NODE_ENV === 'production') return;
    main();
})();