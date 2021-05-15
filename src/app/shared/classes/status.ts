import {Notification} from './notification';

export interface Status {
    name: string;
    id: string;
    notification: Notification;
    status: boolean;
}
