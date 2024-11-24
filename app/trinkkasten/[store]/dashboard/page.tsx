'use client';

import { useState, useEffect } from 'react';
import { Product, Store } from '@/utils/definitions';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function TrinkkastenStoreDashboard() {
  const [store, setStore] = useState<Store>();
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    price: '',
  });

  const router = useRouter();

  // INIT
  useEffect(() => {
    // Initialize Supabase client
    const init = async () => {
      const supabase = await createClient();

      // Fetch USER
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error);
        router.push('/unauthorized');
        return;
      }
      console.log('User: ', user!.id);

      // Fetch STORE
      const storeResponse = await supabase
        .from('stores')
        .select('*')
        .single();
      if (storeResponse.error) {
        console.error('Error fetching store: ', storeResponse.error);
        return;
      }
      const store = storeResponse.data;

      // Check admin privileges
      if (!user || user.id !== store.admin) {
        router.push('/unauthorized');
        return;
      }

      setStore(storeResponse.data);
      console.log('Store: ', store);

      // Fetch PRODUCTS
      const productsResponse = await supabase
        .from('products')
        .select('*')
        .eq('sold_at', store.name)
        .returns<Product[]>();
      if (productsResponse.error) {
        console.error(
          'Error fetching products: ',
          productsResponse.error
        );
        return;
      }
      setProducts(productsResponse.data);
    };

    init();
  }, [router]);

  // ACTIONS
  // Bind form values to selectedProduct
  useEffect(() => {
    if (selectedProduct) {
      setFormValues({
        name: selectedProduct.name,
        price: selectedProduct.price.toFixed(2), // Ensure price is a string formatted to two decimals
      });
    } else {
      setFormValues({
        name: '',
        price: '',
      });
    }
  }, [selectedProduct]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Create
  const handleCreate = async () => {
    if (selectedProduct || !formValues.name || !formValues.price)
      return;

    const supabase = await createClient();
    const createResponse = await supabase.from('products').insert({
      name: formValues.name,
      price: parseFloat(formValues.price),
      sold_at: store!.name,
      active: true,
    });
    if (createResponse.error) {
      console.error('Error creating product: ', createResponse.error);
    } else {
      console.log('Created product: ', createResponse.data);
      // Adapt current state to change
      const productsResponse = await supabase
        .from('products')
        .select('*');
      if (productsResponse.error) {
        console.error(
          'Error refetching the products: ',
          productsResponse.error
        );
      } else {
        setProducts(productsResponse.data);
        setSelectedProduct(null);
      }
    }
  };

  // Update
  const handleUpdate = async () => {
    if (!selectedProduct || !formValues.name || !formValues.price)
      return;

    const supabase = await createClient();
    const updatedProduct = {
      ...selectedProduct,
      name: formValues.name,
      price: parseFloat(formValues.price),
    };

    const { data, error } = await supabase
      .from('products')
      .update(updatedProduct)
      .eq('id', updatedProduct.id);
    if (error) {
      console.error('Error updating product: ', error);
    } else {
      console.log('Product updated: ', updatedProduct);
      // Adapt current state to change
      setProducts((prev) =>
        prev.map((product) =>
          product.id === selectedProduct.id ? updatedProduct : product
        )
      );
    }
  };

  // Toggle Active
  const handleToggle = async () => {
    if (!selectedProduct) return;

    const supabase = await createClient();
    const toggledActive = !selectedProduct.active;

    const { error } = await supabase
      .from('products')
      .update({ active: toggledActive })
      .eq('id', selectedProduct.id);
    if (error) {
      console.error(
        'Error toggling active state of product: ',
        error
      );
    } else {
      console.log(`Product toggled: ${toggledActive}`);
      // Adapting current state to change
      setProducts((prev) =>
        prev.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, active: toggledActive }
            : product
        )
      );
      setSelectedProduct({
        ...selectedProduct,
        active: toggledActive,
      });
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!selectedProduct) return;

    const supabase = await createClient();

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', selectedProduct.id);
    if (error) {
      console.error('Error deleting product: ', error);
    } else {
      console.log(`Product deleted: `, selectedProduct);
      // Adapting current state to change
      setProducts((prev) =>
        prev.filter((product) => product.id !== selectedProduct.id)
      );
      setSelectedProduct(null);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 max-w-3xl justify-center h-[20em]">
        {/* Product List */}
        <div className="col-span-2 flex flex-wrap justify-center gap-4 overflow-y-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className={`product-card bg-opacity-20 ${
                product.id === selectedProduct?.id ? 'selected' : ''
              } ${product.active ? 'bg-primary' : ''}`}
              onClick={() =>
                product.id !== selectedProduct?.id
                  ? setSelectedProduct(product)
                  : setSelectedProduct(null)
              }
            >
              <p>{product.name}</p>
              <p className="text-sm">{product.price.toFixed(2)}€</p>
            </div>
          ))}
        </div>

        {/* Product Form */}
        <div className="w-[16em] pt-12">
          <div className="grid grid-cols-2 gap-2">
            <input
              id="product_name"
              name="name"
              type="text"
              placeholder="Name..."
              value={formValues.name}
              className="col-span-2"
              onChange={handleInputChange}
              required
            />
            <input
              id="product_price"
              name="price"
              type="text"
              placeholder="Price..."
              value={formValues.price}
              onChange={handleInputChange}
              required
            />
            {/* Toolbar */}
            {selectedProduct ? (
              <button
                onClick={handleUpdate}
                className={
                  formValues.name == selectedProduct.name &&
                  parseFloat(formValues.price) ==
                    selectedProduct.price
                    ? 'disabled'
                    : ''
                }
              >
                Update
              </button>
            ) : (
              <button
                onClick={handleCreate}
                className={
                  !formValues.name || !parseFloat(formValues.price)
                    ? 'disabled'
                    : ''
                }
              >
                Create
              </button>
            )}
            {selectedProduct && (
              <button className="secondary" onClick={handleToggle}>
                Toggle
              </button>
            )}
            {selectedProduct && (
              <button className="secondary" onClick={handleDelete}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
      <hr className="my-6" />

      {/* <hr className="my-10 col-span-2" />

<div className="grid gap-6">
<div>
WIP: Latest transactions in your store (maybe timewise view)
        </div>
        <div>WIP: Debt leaderboard</div>
        <div>WIP: Set PayPal Link</div>
        <div>WIP: Edit current balance</div>
        <div>WIP: Separate store leader and control routeGuard</div>
      </div> */}
    </div>
  );
}
