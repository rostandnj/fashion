import {Order} from './order';
import {User} from './user';

export interface Notification {
    code: number;
    id: string;
    order_main: Order;
    user: User;
    date: string;
    customer_name: string;
    customer_phone: string;
}
