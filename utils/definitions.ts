// type Group = {
//   name: string;
//   leader: string;
// };

type Product = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  active?: boolean;
};

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
};

type Store = {
  name: string;
  admin: string;
  paypal_link: string;
};

type Transaction = {
  id: string;
  created_at: Date;
  amount: number;
  items?: Item[];
  description?: string;
  user: Profile; //ID
  store: string; //ID
};

type Item = {
  quantity: number;
  name: string;
  price: number;
};

type Balance = {
  user_id: string;
  first_name: string;
  last_name: string;
  total_amount: number;
};

export type { Product, Profile, Store, Transaction, Balance };
