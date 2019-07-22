import { DefaultCrudRepository } from '@loopback/repository';
import { Topping } from '../models';
import { MlabDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class ToppingRepository extends DefaultCrudRepository<
  Topping,
  typeof Topping.prototype.id
  > {
  constructor(
    @inject('datasources.mlab') dataSource: MlabDataSource,
  ) {
    super(Topping, dataSource);
  }
}
