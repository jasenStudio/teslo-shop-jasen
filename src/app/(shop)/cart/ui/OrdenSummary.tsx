'use client'
import { useCartStore } from '@/store';
import React, { useEffect, useState } from 'react'
import { currencyFormat } from '../../../../utils/CurrentFormat';

export const OrdenSummary = () => {

    const [loaded,setLoaded] = useState(false);
    const {subTotal,itemsCart,tax,total} = useCartStore( state =>  state.getSummaryInformation())

    useEffect(() => {
    
    setLoaded(true)
    
    }, [])

    if(!loaded) return <p>....loading</p>;


  return (

    <div className="grid grid-cols-2">

        <span>No. Productos</span>
            <span className="text-right">
           {itemsCart === 1 ? '1 Articulo' : `${itemsCart} Articulos`}
            </span>

            <span>Subtotal</span>
            <span className="text-right ">
            { currencyFormat(subTotal) }
            </span>

            <span>Impuestos (15%)</span>
            <span className="text-right">
           {currencyFormat(tax)}
            </span>

            <span className="text-2xl mt-5">Total:</span>
            <span className="mt-5  text-2xl text-right">
           {currencyFormat(total)}
            </span>

        </div>
    

   
  )
}
