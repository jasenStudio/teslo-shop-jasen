'use client'
import { placeOrder } from '@/actions';
import { useAddressStore, useCartStore } from '@/store';
import { currencyFormat, sleep } from '@/utils';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export const PlaceOrder = () => {


    const router = useRouter();

    const [loaded,setLoaded]             = useState<boolean>(false);
    const [isPlaceOrder,setIsPlaceOrder] = useState<boolean>(false);
    const [errorMessage,setErrorMessage] = useState<string>('');



    const address = useAddressStore(state =>  state.address );
    const {subTotal,itemsCart,tax,total} = useCartStore( state =>  state.getSummaryInformation())
    const clearCart = useCartStore( state =>  state.clearCart)
    const cart = useCartStore(state => state.cart);

    useEffect(() => {
     setLoaded(true)
    }, [])

    if(!loaded){
        return (<p>Cargando...</p>)
    }

    const onPlacerOrder = async () => {
        setIsPlaceOrder(true);

        const productToOrden =  cart.map( product => ({
            productId: product.id!,
            quantity: product.quantity,
            size: product.size
        }))


       // !Server Action
       const resp = await placeOrder(productToOrden,address);

       if(!resp.ok){
        setIsPlaceOrder(false);
        setErrorMessage(resp.message);
        return;
       }


        // *Success
        clearCart();
        router.replace('/orders/'+ resp.order!.id);
        // await sleep(2);
        
    }
    

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">

    <h2 className="text-2xl mb-2">Dirección de entrega</h2>
    <div className="mb-10">
      <p className="text-xl">
        {address.firstName} {address.lastName}
     </p>
      <p>{address.address}</p>
      <p>{address.address2}</p>
      <p>{address.postalCode}</p>
      <p>
        {address.city},{address.country}
     </p>  
      <p>
      {address.phone}
     </p> 
    </div>

      <div className="w-full h-0.5 rounded bg-gray-200 mb-10"  />

      <h2 className="text-2xl mb-2">Resumen de orden</h2>

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


      <div className="mt-5 mb-2 w-full">

        <p className="mb-5">

              <span className="text-xs">
                Al hacer click &quot; generar orden &quot; ,aceptas nuestros <a href="#" className="underline">terminos y condiciones</a> y <a href="#" className="underline">politicas de privacidad</a>
              </span>
        </p>

        <p className='text-red-500'>{errorMessage}</p>

        <button 
            onClick={ onPlacerOrder }  
        //   href={'/orders/123'}
          className={
            clsx({
                'btn-primary' : !isPlaceOrder,
                'btn-disabled': isPlaceOrder
            })
          }
          >
            Generar orden
          </button>
      </div>



    </div>
  )
}
