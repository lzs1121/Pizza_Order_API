import { Entity, model, property } from '@loopback/repository';

@model({ settings: {} })
export class Topping extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'string',
  })
  image?: string;


  constructor(data?: Partial<Topping>) {
    super(data);
  }
}

export interface ToppingRelations {
  // describe navigational properties here
}

export type ToppingWithRelations = Topping & ToppingRelations;
