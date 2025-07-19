import type { PiniaStore } from '../src'
import { createPinia } from 'pinia'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { defineGenericStore, useStore } from '../src'

// #region Base Model Store
interface BaseModel {
  id: number
}

class BaseModelService<T extends BaseModel> {
  find(): T[] {
    return []
  }
}

type BaseModelStore<T extends BaseModel> = PiniaStore<
  'baseModel',
  {
    items: T[]
  },
  {
    service: () => BaseModelService<T>
  },
  {
    find: () => Promise<T[]>
  }
>

function baseModelStore<T extends BaseModel>() {
  return defineGenericStore<BaseModelStore<T>>({
    state: {
      items: [],
    },
    getters: {
      service: () => new BaseModelService<T>(),
    },
    actions: {
      async find() {
        this.items = this.service.find()
        return this.items
      },
    },
  })
}
// #endregion

// #region Base Named Model Store
interface BaseNamedModel extends BaseModel {
  name: string
}

type BaseNamedModelStore<T extends BaseNamedModel> = PiniaStore<
  'baseNamedModel',
  object,
  {
    baseSearchOptions: () => { orderby: string }
  },
  object,
  BaseModelStore<T>
>

function baseNamedModelStore<T extends BaseNamedModel>() {
  return defineGenericStore<BaseNamedModelStore<T>, BaseModelStore<T>>(
    {
      getters: {
        baseSearchOptions: () => ({ orderby: 'name asc' }),
      },
    },
    baseModelStore<T>(),
  )
}
// #endregion

// #region Concrete Store (Country)
interface Country extends BaseNamedModel {
  code: string
}

class CountryService extends BaseModelService<Country> {}

type CountryStore = PiniaStore<'country', object, object, object, BaseNamedModelStore<Country>>

const useCountryStore = useStore<CountryStore, BaseNamedModelStore<Country>>(
  'country',
  {
    getters: {
      service: () => new CountryService(),
    },
  },
  baseNamedModelStore<Country>(),
)
// #endregion

// #region Concrete Store (Catalogue)
interface Catalogue extends BaseNamedModel {
  type: string
}

class CatalogueService extends BaseModelService<Catalogue> {}

type CatalogueStore = PiniaStore<'catalogue', object, object, object, BaseNamedModelStore<Catalogue>>

const useCatalogueStore = useStore<CatalogueStore, BaseNamedModelStore<Catalogue>>(
  'catalogue',
  {
    getters: {
      service: () => new CatalogueService(),
    },
  },
  baseNamedModelStore<Catalogue>(),
)
// #endregion

describe('complex generic store setup', () => {
  it('should have correct types', () => {
    const pinia = createPinia()
    const store = useCountryStore(pinia)
    // state
    expectTypeOf(store.items).toEqualTypeOf<Country[]>()
    // getters
    expectTypeOf(store.service).toEqualTypeOf<BaseModelService<Country>>()
    expectTypeOf(store.baseSearchOptions).toEqualTypeOf<{ orderby: string }>()
    // actions
    expectTypeOf(store.find).toEqualTypeOf<() => Promise<Country[]>>()
  })

  it('should create a store with multi-level inheritance', () => {
    const pinia = createPinia()
    const store = useCountryStore(pinia)
    expect(store).toBeDefined()
    expect(store.$id).toBe('country')
  })

  it('should inherit properties from all levels', async () => {
    const pinia = createPinia()
    const store = useCountryStore(pinia)
    expect(store.items).toEqual([])
    expect(store.baseSearchOptions).toEqual({ orderby: 'name asc' })
    expect(store.service).toBeInstanceOf(CountryService)
    await store.find()
    expect(store.items).toEqual([])
  })

  it('should allow inter-store communication', async () => {
    const pinia = createPinia()
    const countryStore = useCountryStore(pinia) as any
    const catalogueStore = useCatalogueStore(pinia)

    catalogueStore.items = [{ id: 1, name: 'Catalogue 1', type: 'A' }]

    countryStore.getCountryCatalogue = async function () {
      const catalogues = catalogueStore.items
      return catalogues.map(c => ({
        country: this.items[0]?.name,
        catalogue: c.name,
      }))
    }

    countryStore.items = [{ id: 1, name: 'Country 1', code: 'C1' }]
    const result = await countryStore.getCountryCatalogue()

    expect(result).toEqual([
      { country: 'Country 1', catalogue: 'Catalogue 1' },
    ])
  })
})
