'use client'
import { getStockBySlug } from "@/actions"
import { titleFont } from "@/config/font"
import { useEffect, useState } from "react"

interface Props {
    slug:string
}

export const StockLabel = ({slug}:Props) => {

    const [stock, setStock] = useState(0);
    const [isLoading, setIsloading] = useState(true);

    useEffect(() => {
        const getStock = async () => {
            const inStock = await getStockBySlug(slug);
            setStock(Number(inStock));
            setIsloading(false)
        }
        getStock();
    }, [slug])
    


  return (
    <>  
         {
            isLoading 
                ?
                 (  <h1 className={`${ titleFont.className} antialiased font-bold text-lg animate-pulse bg-gray-200`}>
                        &nbsp;
                    </h1>
                 )
                : 
                 (
                    <h1 className={`${ titleFont.className} antialiased font-bold text-lg`}>
                    {/* Stock:{stock} */}
                    Stock:{stock}
                    </h1>
                 ) 
         }
    </>
  )
}
