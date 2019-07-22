import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import { Topping } from '../models';
import { ToppingRepository } from '../repositories';

export class ToppingController {
  constructor(
    @repository(ToppingRepository)
    public toppingRepository: ToppingRepository,
  ) { }

  @post('/toppings', {
    responses: {
      '200': {
        description: 'Topping model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Topping } } },
      },
    },
  })
  async create(@requestBody() topping: Topping): Promise<Topping> {
    console.log('create a topping, name ======>>>>>>', topping.name);
    let existedNames: Topping[] = await this.toppingRepository.find({
      where: {
        name: topping.name
      }
    });
    console.log('create a topping, existedName ==========>>>>>>', existedNames);
    if (existedNames && existedNames.length > 0) {
      throw new HttpErrors.BadRequest("name existed");
    }

    // if (!topping.name) {
    //   throw new HttpErrors.BadRequest("name is required");
    // }
    return await this.toppingRepository.create(topping);
  }

  @get('/toppings/count', {
    responses: {
      '200': {
        description: 'Topping model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Topping)) where?: Where<Topping>,
  ): Promise<Count> {
    return await this.toppingRepository.count(where);
  }

  @get('/toppings', {
    responses: {
      '200': {
        description: 'Array of Topping model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Topping } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Topping)) filter?: Filter<Topping>,
  ): Promise<Topping[]> {
    return await this.toppingRepository.find(filter);
  }

  @patch('/toppings', {
    responses: {
      '200': {
        description: 'Topping PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() topping: Topping,
    @param.query.object('where', getWhereSchemaFor(Topping)) where?: Where<Topping>,
  ): Promise<Count> {
    return await this.toppingRepository.updateAll(topping, where);
  }

  @get('/toppings/{id}', {
    responses: {
      '200': {
        description: 'Topping model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Topping } } },
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Topping> {
    return await this.toppingRepository.findById(id);
  }

  @patch('/toppings/{id}', {
    responses: {
      '204': {
        description: 'Topping PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() topping: Topping,
  ): Promise<void> {
    await this.toppingRepository.updateById(id, topping);
  }

  @put('/toppings/{id}', {
    responses: {
      '204': {
        description: 'Topping PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() topping: Topping,
  ): Promise<void> {
    await this.toppingRepository.replaceById(id, topping);
  }

  @del('/toppings/{id}', {
    responses: {
      '204': {
        description: 'Topping DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.toppingRepository.deleteById(id);
  }
}
