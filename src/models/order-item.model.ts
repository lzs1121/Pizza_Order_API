import { Model, model, property } from '@loopback/repository';

@model({ settings: {} })
export class OrderItem extends Model {
  @property({
    type: 'string',
    required: true,
  })
  toppingId: string;

  @property({
    type: 'number',
    required: true,
  })
  amount: number;


  constructor(data?: Partial<OrderItem>) {
    super(data);
  }
}

export interface OrderItemRelations {
  // describe navigational properties here
}

export type OrderItemWithRelations = OrderItem & OrderItemRelations;
