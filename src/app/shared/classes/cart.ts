import {CartItem} from './cartItem';

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  location: string;
  contact: string;
}
