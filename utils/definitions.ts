type Product = {
  id: number;
  name: string;
  price: number;
  quantity?: number;
};

type Profile = {
  id: number;
  firstName: string;
  lastName: string;
};
export type { Product, Profile };
