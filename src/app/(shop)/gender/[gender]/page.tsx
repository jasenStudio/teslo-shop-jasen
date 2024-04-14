export const revalidate = 60;

import { getPaginationProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender} from "@/interfaces";
import { initialData } from "@/seed/seed";
import { notFound, redirect } from "next/navigation";

interface Props {
  params:{
    gender:string,
  },
  searchParams: {
    page?:string
  }
}


const products = initialData.products;


export default async function GenderPage({params,searchParams}:Props) {

const gender = params.gender as Gender;
const page  = searchParams.page ? parseInt(searchParams.page) : 1;

const genders:Record<string,string> = {
  men:'para hombres',
  women:'para mujeres',
  kid:'para niños',
  unisex:'para todos'
}

// const productsByGategory = products.filter( product => product.gender === gender);
const { products,currentPage,totalPages }= await getPaginationProductsWithImages({page,gender});

const labels = genders[gender];

if(products.length === 0){
  redirect(`/gender/${gender}`)
}

  
  return (
   <>
     <Title 
  title={`Articulos ${labels}`}
  subtitle={'Todos los articulos'} 
  className="mb-2" />
   
   <ProductGrid products={products}/>

   <Pagination totalPages={totalPages} />
   </>
  );
}