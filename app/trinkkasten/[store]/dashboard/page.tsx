'use client';

import { useState, useEffect } from 'react';
import { Product, Transaction } from '@/utils/definitions';
import { createClient } from '@/utils/supabase/client';
import { redirect, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Amount from '@/app/components/amount';
import { DataContextType, useData } from '../DataContext';

type Balance = {
  user_id: string;
  first_name: string;
  last_name: string;
  total_amount: number;
};

export default function TrinkkastenStoreDashboard() {
  const { user, store } = useData() as DataContextType;

  if (!user || store.admin != user.id) redirect('/');

  // Products
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
  });

  // Transaction/Balances
  const [latestTransactions, setLatestTransactions] = useState<
    Transaction[]
  >([]);
  const [balances, setBalances] = useState<Balance[]>([]);

  const [selectedBalance, setSelectedBalance] =
    useState<Balance | null>(null);
  const [amountForm, setAmountForm] = useState('');

  const router = useRouter();

  // INIT
  useEffect(() => {
    const init = async () => {
      const supabase = createClient();

      // Fetch products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('sold_at', store.name);

      if (productsError) {
        console.error('Error fetching products:', productsError);
      } else {
        setProducts(products || []);
      }

      // Fetch latest transactions
      const { data: latestTransactions, error: transactionsError } =
        await supabase
          .from('transactions')
          .select(
            'id, created_at, user (id, first_name, last_name), amount, items, description, store'
          )
          .eq('store', store.name)
          .order('created_at', { ascending: false })
          .limit(30)
          .returns<Transaction[]>();

      if (transactionsError) {
        console.error(
          'Error fetching latest transactions:',
          transactionsError
        );
      } else {
        setLatestTransactions(latestTransactions || []);
      }

      // Fetch balances
      const { data: balances, error: balancesError } =
        await supabase.rpc('get_store_balances', {
          store_name: store.name,
        });

      if (balancesError) {
        console.error('Error fetching balances:', balancesError);
      } else {
        setBalances(balances || []);
      }
    };

    init();
  }, [router]);

  // ACTIONS
  // Bind form values to selectedProduct
  useEffect(() => {
    if (selectedProduct) {
      setProductForm({
        name: selectedProduct.name,
        price: selectedProduct.price.toFixed(2),
      });
    } else {
      setProductForm({
        name: '',
        price: '',
      });
    }
  }, [selectedProduct]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      setAmountForm(value);
    } else {
      setProductForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Create
  const handleCreate = async () => {
    if (selectedProduct || !productForm.name || !productForm.price)
      return;

    const supabase = await createClient();
    const createResponse = await supabase.from('products').insert({
      name: productForm.name,
      price: parseFloat(productForm.price),
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
        .select('*')
        .eq('sold_at', store.name);
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
    if (!selectedProduct || !productForm.name || !productForm.price)
      return;

    const supabase = await createClient();
    const updatedProduct = {
      ...selectedProduct,
      name: productForm.name,
      price: parseFloat(productForm.price),
    };

    const { error } = await supabase
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

  const handleAddTransaction = async () => {
    if (!selectedBalance || !amountForm) return;

    const supabase = createClient();
    const { error } = await supabase.from('transactions').insert({
      user: selectedBalance.user_id,
      amount: parseFloat(amountForm),
      store: store?.name,
      description: 'Admin transaction',
    });

    if (error) {
      console.error('Error adding transaction:', error);
    } else {
      setAmountForm('');
      setSelectedBalance(null);
    }
  };

  return (
    <div className="pb-8 max-w-3xl mx-auto">
      <div className="grid md:grid-cols-3 gap-3 max-w-3xl justify-center py-3">
        {/* Product List */}
        <div className="md:col-span-2 flex md:max-h-[20em] flex-wrap justify-center gap-4 overflow-y-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className={`product-card bg-opacity-20 h-fit ${
                product.id === selectedProduct?.id ? 'selected' : ''
              } ${product.active ? 'bg-green-500' : ''}`}
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
        <div className="w-[16em] pt-8 mx-auto">
          <div className="grid grid-cols-2 gap-2">
            <input
              id="product_name"
              name="name"
              type="text"
              placeholder="Name..."
              value={productForm.name}
              className="col-span-2"
              onChange={handleInputChange}
              required
            />
            <input
              id="product_price"
              name="price"
              type="text"
              placeholder="Price..."
              value={productForm.price}
              onChange={handleInputChange}
              required
            />
            {/* Toolbar */}
            {selectedProduct ? (
              <button
                onClick={handleUpdate}
                className={
                  productForm.name == selectedProduct.name &&
                  parseFloat(productForm.price) ==
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
                  !productForm.name || !parseFloat(productForm.price)
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

      <hr className="my-10 col-span-2" />

      <div>
        <h3>Balances</h3>
        <p className="description">Click on a name to see more</p>
        <div className="grid grid-cols-2 my-2">
          <div>
            <table className="table-auto border-separate border-spacing-x-2">
              <tbody>
                {balances.map((balance, index) => (
                  <tr
                    key={index}
                    onClick={() =>
                      balance != selectedBalance
                        ? setSelectedBalance(balance)
                        : setSelectedBalance(null)
                    }
                    className="cursor-pointer"
                  >
                    <td className="text-right">
                      {Amount(balance.total_amount)}
                    </td>
                    <td
                      className={
                        balance == selectedBalance
                          ? 'font-bold'
                          : 'font-extralight'
                      }
                    >
                      {balance.first_name} {balance.last_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedBalance && (
            <div>
              <h4>
                {selectedBalance.first_name}{' '}
                {selectedBalance.last_name}
              </h4>
              <div className="mt-2 flex gap-2">
                <input
                  id="transaction_amount"
                  name="amount"
                  type="text"
                  placeholder="Amount..."
                  value={amountForm}
                  onChange={handleInputChange}
                  required
                />
                <button onClick={handleAddTransaction}>Submit</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <hr className="my-10 col-span-2" />

      <div>
        <h3>Latest transactions</h3>
        <table className="w-full border-separate border-spacing-3 text-left justify">
          <thead>
            <tr>
              <th>When?</th>
              <th>Who?</th>
              <th className="text-center">How much?</th>
              <th>What?</th>
            </tr>
          </thead>
          <tbody>
            {latestTransactions.map((transaction) => (
              <tr key={transaction.id} className="align-top">
                <td>
                  {format(
                    new Date(transaction.created_at),
                    'dd.MM. hh:mm'
                  )}
                </td>
                <td>
                  {transaction.user?.first_name}{' '}
                  {transaction.user?.last_name}
                </td>
                <td className="text-center">
                  {Amount(transaction.amount)}
                </td>
                <td className="max-w-[10em]">
                  {transaction.description && (
                    <p className="font-extralight italic">
                      {transaction.description}
                    </p>
                  )}
                  {transaction.items &&
                    transaction.items.map((item, index) => (
                      <p key={index}>
                        {item.quantity}x {item.name} -{' '}
                        {item.price.toFixed(2)}€
                      </p>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*
IGNORE THIS
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
