import { Filter } from '@loopback/repository';
import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import { ToppingController } from '../../../controllers';
import { Topping } from '../../../models/index';
import { ToppingRepository } from '../../../repositories';
import { givenTopping } from '../../helpers';

describe('ToppingController', () => {
  let toppingRepo: StubbedInstanceWithSinonAccessor<ToppingRepository>;

  /*
  =============================================================================
  METHOD STUBS
  These handles give us a quick way to fake the response of our repository
  without needing to wrangle fake repository objects or manage real ones
  in our tests themselves.
  =============================================================================
   */
  let create: sinon.SinonStub;
  let findById: sinon.SinonStub;
  let find: sinon.SinonStub;
  let replaceById: sinon.SinonStub;
  let updateById: sinon.SinonStub;
  let deleteById: sinon.SinonStub;

  /*
  =============================================================================
  TEST VARIABLES
  Combining top-level objects with our resetRepositories method means we don't
  need to duplicate several variable assignments (and generation statements)
  in all of our test logic.

  NOTE: If you wanted to parallelize your test runs, you should avoid this
  pattern since each of these tests is sharing references.
  =============================================================================
  */
  let controller: ToppingController;
  let aTopping: Topping;
  let aToppingWithId: Topping;
  let aChangedTopping: Topping;
  let aListOfToppings: Topping[];

  beforeEach(resetRepositories);

  describe('createTopping', () => {
    it('creates a Topping', async () => {
      create.resolves(aToppingWithId);
      const result = await controller.create(aTopping);
      expect(result).to.eql(aToppingWithId);
      sinon.assert.calledWith(create, aTopping);
    });
  });

  describe('findToppingById', () => {
    it('returns a Topping if it exists', async () => {
      findById.resolves(aToppingWithId);
      expect(await controller.findById(aToppingWithId.id as string)).to.eql(
        aToppingWithId,
      );
      sinon.assert.calledWith(findById, aToppingWithId.id);
    });
  });

  describe('findToppings', () => {
    it('returns multiple Toppings if they exist', async () => {
      find.resolves(aListOfToppings);
      expect(await controller.find()).to.eql(aListOfToppings);
      sinon.assert.called(find);
    });

    it('returns empty list if no toppings exist', async () => {
      const expected: Topping[] = [];
      find.resolves(expected);
      expect(await controller.find()).to.eql(expected);
      sinon.assert.called(find);
    });

    it('uses the provided filter', async () => {
      const filter: Filter<Topping> = { where: { name: 'bacon' } };

      find.resolves(aListOfToppings);
      await controller.find(filter);
      sinon.assert.calledWith(find, filter);
    });
  });

  describe('replaceTopping', () => {
    it('successfully replaces existing items', async () => {
      replaceById.resolves();
      await controller.replaceById(aToppingWithId.id as string, aChangedTopping);
      sinon.assert.calledWith(replaceById, aToppingWithId.id, aChangedTopping);
    });
  });

  describe('updateTopping', () => {
    it('successfully updates existing items', async () => {
      updateById.resolves();
      await controller.updateById(aToppingWithId.id as string, aChangedTopping);
      sinon.assert.calledWith(updateById, aToppingWithId.id, aChangedTopping);
    });
  });

  describe('deleteTopping', () => {
    it('successfully deletes existing items', async () => {
      deleteById.resolves();
      await controller.deleteById(aToppingWithId.id as string);
      sinon.assert.calledWith(deleteById, aToppingWithId.id);
    });
  });

  function resetRepositories() {
    toppingRepo = createStubInstance(ToppingRepository);
    aTopping = givenTopping();
    aToppingWithId = givenTopping({
      id: "1",
    });
    aListOfToppings = [
      aToppingWithId,
      givenTopping({
        id: "2",
        name: 'bacon',
      }),
    ] as Topping[];
    aChangedTopping = givenTopping({
      id: aToppingWithId.id,
      name: 'cheese',
    });

    // Setup CRUD fakes
    ({
      create,
      findById,
      find,
      updateById,
      replaceById,
      deleteById,
    } = toppingRepo.stubs);

    controller = new ToppingController(toppingRepo);
  }
});
