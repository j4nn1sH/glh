'use client';

import { useData, DataContextType } from './DataContext';
import { Product } from '@/utils/definitions';

import Link from 'next/link';

export default function TrinkkastenStorePage() {
  const { products, cart, setCart } = useData() as DataContextType;

  const addProduct = (product: Product) => {
    // Add product to cart or increase quantity
    const existingProduct = cart.products.find(
      (p) => p.id === product.id
    );
    if (existingProduct) {
      existingProduct.quantity! += 1;
      setCart({ ...cart, products: [...cart.products] });
    } else {
      setCart({
        ...cart,
        products: [...cart.products, { ...product, quantity: 1 }],
      });
    }
  };

  const quantity = (product: Product) => {
    const existingProduct = cart.products.find(
      (p) => p.id === product.id
    );
    return existingProduct?.quantity || 0;
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6">
      <p className="description">What do you want?</p>
      <div className="max-w-lg flex flex-wrap justify-center gap-4 max-h-[50vh] overflow-y-auto">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => addProduct(product)}
            className={`product-card ${
              quantity(product) > 0 ? 'active' : ''
            } hover:border-primary`}
          >
            <p>{product.name}</p>
            <p className="text-sm">
              {quantity(product)} | {product.price.toFixed(2)}€
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          className="btn-secondary"
          onClick={() => setCart({ ...cart, products: [] })}
        >
          Reset
        </button>
        <Link
          className={`btn ${
            cart.products.length === 0 ? 'disabled' : ''
          }`}
          href={`/trinkkasten/${cart.store}/select`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
