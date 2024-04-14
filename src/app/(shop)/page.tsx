export const revalidate = 60;


import { getPaginationProductsWithImages } from "@/actions";
import { ProductGrid, Title } from "@/components";
import { initialData } from "@/seed/seed";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Pagination } from '../../components/ui/pagination/Pagination';


// const products = initialData.products;

interface Props {
  searchParams: {
    page?: string;
  }
}

export default async function Home({searchParams}:Props) {


const page  = searchParams.page ? parseInt(searchParams.page) : 1;


const { products,currentPage,totalPages }= await getPaginationProductsWithImages({page});


if(products.length === 0){
  redirect('/')
}

  return (
 <>
  <Title 
  title="Tienda" 
  subtitle="Todos los productos" 
  className="mb-2" />

  <ProductGrid products={products}/>


  <Pagination totalPages={totalPages} />
 </>
  );
}
