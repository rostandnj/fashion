import {CartItem} from './cartItem';
import {ShopMini} from './shopMini';

export interface CartDisplay {
  shop: ShopMini;
  cartItem: CartItem[];
  totalPrice: number;
}
