"use client";

import { QuantitySelector, SizeSelector } from "@/components";
import { CartProduct, Product, Size } from "@/interfaces";
import { useCartStore } from "@/store";
import React, { useState } from "react";

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {

  const addProductToCart = useCartStore( state => state.addProductToCart);

  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState(false);

  const addToCart = () => {
    setPosted(true);
    console.log({ size, quantity });
    if (!size) return;


    const CartProduct:CartProduct = {
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: quantity,
      size: size,
      image: product.images[0],
      id:product.id
    }
    
    //TODO ADD TO CART
    addProductToCart(CartProduct); 

    setPosted(false);
    setQuantity(1)
    setSize(undefined);

  };

  return (
    <>
      {posted && !size && (
        <span className="mt-2 text-red-500">Debe seleccionar una talla</span>
      )}

      <SizeSelector
        onSizeChanged={(size) => setSize(size)}
        selectedSize={size}
        availableSizes={product.sizes}
      />

      <QuantitySelector
        quantity={quantity}
        onQuantityChanged={(quantity) => setQuantity(quantity)}
      />

      <button onClick={addToCart} className="btn-primary my-5">
        Agregar al carrito
      </button>
    </>
  );
};
