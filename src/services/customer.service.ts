import { getService } from '@loopback/service-proxy';
import { inject, Provider } from '@loopback/core';
import { CustomerDataSource } from '../datasources';
import { Customer } from '../models/customer.model';

export interface CustomerService {
  getById(customerId: string): Promise<Customer>;
}

export class CustomerServiceProvider implements Provider<CustomerService> {
  constructor(
    // customer must match the name property in the datasource json file
    @inject('datasources.customer')
    protected dataSource: CustomerDataSource = new CustomerDataSource(),
  ) { }

  value(): Promise<CustomerService> {
    return getService(this.dataSource);
  }
}
