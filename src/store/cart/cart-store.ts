import { CartProduct } from "@/interfaces";
import { Product } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];

  getTotalItems:() =>  number;
  getSummaryInformation:() => {
    subTotal: number;
    tax: number;
    total: number;
    itemsCart: number;
};

  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity:(product:CartProduct,quantity:number) => void;
  removeProduct:(product:CartProduct) => void;
  // updateProductQuantity:() => void;
  // removeProduct:() => void;

  clearCart: ()  => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      getTotalItems:() => {
          const { cart } = get();
          const total =  cart.reduce( (total,item) => total + item.quantity, 0 );
          return total;
      },
      getSummaryInformation:() => {
        const { cart } = get();
        const subTotal =  cart.reduce( (subTotal,product) => 
        (product.quantity * product.price) + subTotal, 0 );

        const tax = subTotal * 0.15;
        const total = subTotal + tax;
        const itemsCart = cart.reduce((total,item) =>  total +item.quantity,0)

          return{
            subTotal,
            tax,
            total,
            itemsCart
          }
      },
      addProductToCart: (product: CartProduct) => {
        const { cart } = get();
        console.log(cart);
        //1. revisarsi el producto existe
        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size
        );

        if (!productInCart) {

          set({ cart: [...cart, product] });
          return;
        }

        //2. Se quel producto existe por talla... tengo que incrementar
        const updateCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: item.quantity + product.quantity };
          }

          return item;
        });
        console.log(updateCartProducts);
        console.log(productInCart)
        set({ cart: updateCartProducts });
      },
      updateProductQuantity:(product:CartProduct,quantity:number) => {
         const { cart } = get();
        
         const updateCartProducts = cart.map((item) => {
            if (item.id === product.id && item.size === product.size) {
              return { ...item, quantity: quantity };
            }
            return item;
          });

          set({ cart: updateCartProducts });

      },
      removeProduct:(product:CartProduct) => {
        const { cart } = get();
   
        const removeProduct = cart.filter((item) => (item.size != product.size || product.id != item.id) );
        set({ cart: removeProduct });
      },

      clearCart:() => {
        set({cart:[]})
      },
    }),
    {
      name: "shopping-cart",
    }
  )
);
