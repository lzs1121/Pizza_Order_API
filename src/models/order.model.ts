import { Entity, model, property } from '@loopback/repository';
import { OrderItem } from './order-item.model';

@model({ settings: {} })
export class Order extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;


  @property.array(OrderItem, {
    name: 'orderItems'
  })
  toppings: OrderItem[];

  @property({
    type: 'string',
  })
  customerId: string;

  @property({
    type: 'string',
  })
  customerName?: string;

  @property({
    type: 'date',
  })
  createdTime?: string;


  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
}

export type OrderWithRelations = Order & OrderRelations;
