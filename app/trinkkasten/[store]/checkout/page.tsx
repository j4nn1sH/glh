'use client';

import { useEffect } from 'react';
import { useData, DataContextType } from '../DataContext';
import { createClient } from '@/utils/supabase/client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Checkout() {
  const { cart, setCart } = useData() as DataContextType;
  const router = useRouter();

  useEffect(() => {
    // Redirect on invalid state
    if (!cart.products.length) {
      router.push(`/trinkkasten/${cart.store}`);
    } else if (!cart.user) {
      router.push(`/trinkkasten/${cart.store}/select`);
    }
  }, [cart, router]);

  const total = cart.products.reduce(
    (acc, product) => acc + product.price * product.quantity!,
    0
  );

  const handleConfirm = async () => {
    const supabase = createClient();
    const { error } = await supabase.from('transactions').insert({
      amount: -total,
      user: cart.user?.id,
      store: cart.store,
      items: cart.products.map((product) => ({
        quantity: product.quantity,
        name: product.name,
        price: product.price,
      })), // Corrected mapping for items
    });

    if (error) {
      console.error('Error inserting transaction:', error);
    } else {
      setCart({
        store: cart.store,
        products: [],
        user: null,
      });
      router.push(`/trinkkasten/${cart.store}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6">
      <p className="description">Are you sure?</p>
      <div className="flex flex-col gap-4 my-6 text-center">
        <p className="text-lg font-semibold">
          {cart.user?.first_name} {cart.user?.last_name}
        </p>
        {cart.products.map((product) => (
          <p key={product.id}>
            {product.quantity}x {product.name} -{' '}
            {product.price.toFixed(2)}€
          </p>
        ))}
        <hr />
        <p className="text-lg font-bold text-center">
          Total: {total.toFixed(2)}€
        </p>
      </div>

      <div className="flex gap-3">
        <Link href={`/trinkkasten/${cart.store}/select`}>
          <button className="secondary">Back</button>
        </Link>
        <button className="btn" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
}
