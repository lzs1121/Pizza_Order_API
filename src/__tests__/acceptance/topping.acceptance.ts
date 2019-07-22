// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/example-topping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { EntityNotFoundError } from '@loopback/repository';
import {
  Client,
  createRestAppClient,
  expect,
  givenHttpServerConfig,
  toJSON,
} from '@loopback/testlab';
import { PizzaOrderApiApplication } from '../../application';
import { Topping } from '../../models';
import { ToppingRepository } from '../../repositories';
import {
  givenTopping,
} from '../helpers';

describe('ToppingApplication', () => {
  let app: PizzaOrderApiApplication;
  let client: Client;
  let toppingRepo: ToppingRepository;

  before(givenRunningApplicationWithCustomConfiguration);
  after(() => app.stop());

  before(givenToppingRepository);
  before(() => {
    client = createRestAppClient(app);
  });

  beforeEach(async () => {
    await toppingRepo.deleteAll();
  });

  it('creates a topping', async function () {
    this.timeout(30000);
    const topping = givenTopping();
    const response = await client
      .post('/toppings')
      .send(topping)
      .expect(200);
    expect(response.body).to.containDeep(topping);
    const result = await toppingRepo.findById(response.body.id);
    expect(result).to.containDeep(topping);
  });

  it('rejects requests to create a topping with no name', async () => {
    const topping = givenTopping();
    delete topping.name;
    await client
      .post('/toppings')
      .send(topping)
      .expect(422);
  });

  context('when dealing with a single persisted topping', () => {
    let persistedTopping: Topping;

    beforeEach(async () => {
      persistedTopping = await givenToppingInstance();
    });

    it('gets a topping by ID', () => {
      return client
        .get(`/toppings/${persistedTopping.id}`)
        .send()
        .expect(200, toJSON(persistedTopping));
    });

    it('returns 404 when getting a topping that does not exist', () => {
      return client.get('/toppings/99999').expect(404);
    });

    it('replaces the topping by ID', async () => {
      const updatedTopping = givenTopping({
        price: 10
      });
      await client
        .put(`/toppings/${persistedTopping.id}`)
        .send(updatedTopping)
        .expect(204);
      const result = await toppingRepo.findById(persistedTopping.id);
      expect(result).to.containEql(updatedTopping);
    });

    it('returns 404 when replacing a topping that does not exist', () => {
      return client
        .put('/toppings/99999')
        .send(givenTopping())
        .expect(404);
    });

    it('updates the topping by ID ', async () => {
      const updatedTopping = givenTopping({
        price: 10
      });
      await client
        .patch(`/toppings/${persistedTopping.id}`)
        .send(updatedTopping)
        .expect(204);
      const result = await toppingRepo.findById(persistedTopping.id);
      expect(result).to.containEql(updatedTopping);
    });

    it('returns 404 when updating a topping that does not exist', () => {
      return client
        .patch('/toppings/99999')
        .send(givenTopping({ price: 100 }))
        .expect(404);
    });

    it('deletes the topping', async () => {
      await client
        .del(`/toppings/${persistedTopping.id}`)
        .send()
        .expect(204);
      await expect(toppingRepo.findById(persistedTopping.id)).to.be.rejectedWith(
        EntityNotFoundError,
      );
    });

    it('returns 404 when deleting a topping that does not exist', async () => {
      await client.del(`/toppings/99999`).expect(404);
    });
  });

  it('queries toppings with a filter', async () => {
    await givenToppingInstance({ name: 'topping' });

    const toppingInProgress = await givenToppingInstance({
      name: 'bread',
    });

    await client
      .get('/toppings')
      .query({ filter: { where: { name: 'bread' } } })
      .expect(200, [toJSON(toppingInProgress)]);
  });

  /*
   ============================================================================
   TEST HELPERS
   These functions help simplify setup of your test fixtures so that your tests
   can:
   - operate on a "clean" environment each time (a fresh in-memory database)
   - avoid polluting the test with large quantities of setup logic to keep
   them clear and easy to read
   - keep them DRY (who wants to write the same stuff over and over?)
   ============================================================================
   */

  async function givenRunningApplicationWithCustomConfiguration() {
    app = new PizzaOrderApiApplication({
      rest: givenHttpServerConfig(),
    });

    await app.boot();

    /**
     * Override default config for DataSource for testing so we don't write
     * test data to file when using the memory connector.
     */
    app.bind('datasources.config.mlab').to({
      name: 'db',
      connector: 'memory',
    });

    // Start Application
    await app.start();
  }

  async function givenToppingRepository() {
    toppingRepo = await app.getRepository(ToppingRepository);
  }

  async function givenToppingInstance(topping?: Partial<Topping>) {
    return await toppingRepo.create(givenTopping(topping));
  }
});
