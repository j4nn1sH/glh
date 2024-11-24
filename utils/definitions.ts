// type Group = {
//   name: string;
//   leader: string;
// };

type Product = {
  id: number;
  name: string;
  price: number;
  quantity?: number;
  active?: boolean;
};

type Profile = {
  id: number;
  first_name: string;
  last_name: string;
};

type Store = {
  name: string;
  admin: string;
};
export type { Product, Profile, Store };
