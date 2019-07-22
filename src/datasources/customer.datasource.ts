import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './customer.datasource.json';

export class CustomerDataSource extends juggler.DataSource {
  static dataSourceName = 'customer';

  constructor(
    @inject('datasources.config.customer', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
