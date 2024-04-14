import { getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductForm } from './ui/ProductForm';
import { getCategories } from "@/actions/category/get-categories";

interface Props {
  params:{
    slug:string
  }
}

export default async function ProductAdmin({params}:Props) {

    const { slug } = params;

    const [product,categories] = await Promise.all([
      getProductBySlug(slug),
      getCategories()
    ])


    if ( !product && slug !== 'new' ) {
      redirect('/admin/products')
    }

    const title = (slug === 'new') ? 'Nuevo producto' : `Editar ${product!.title}`;



  return (
    <div>
      <Title title={ title } />

      <ProductForm product={product ?? {}} categories={categories! ?? []}/>
    </div>
  );
}