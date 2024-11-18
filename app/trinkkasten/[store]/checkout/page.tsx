'use client';

import { useData, DataContextType } from '../DataContext';
import { createClient } from '@/utils/supabase/client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Checkout() {
  const { cart, setCart } = useData() as DataContextType;
  const router = useRouter();

  // Redirect on invalid state
  if (!cart.products.length) {
    router.push(`/trinkkasten/${cart.store}`);
  }
  if (!cart.user) {
    router.push(`/trinkkasten/${cart.store}/select`);
  }

  const total = cart.products.reduce((acc, product) => {
    return acc + product.price * product.quantity!;
  }, 0);

  const handleConfirm = async () => {
    const supabase = await createClient();
    const { error } = await supabase.from('transactions').insert({
      amount: total,
      user: cart.user?.id,
      store: cart.store,
      description: cart.products
        .map(
          (product) =>
            `${product.quantity}x ${
              product.name
            } - ${product.price.toFixed(2)}€`
        )
        .join(', '),
    });
    if (error) {
      console.error(error);
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
          {cart.user?.firstName} {cart.user?.lastName}
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

      <div className="flex gap-4">
        <Link
          className="btn-secondary"
          href={`/trinkkasten/${cart.store}/select`}
        >
          back
        </Link>
        <button className="btn" onClick={handleConfirm}>
          confirm
        </button>
      </div>
    </div>
  );
}
