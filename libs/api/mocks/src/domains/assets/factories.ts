import { factory, faker } from '@island.is/shared/mocking'
import { types } from '@island.is/service-portal/assets'

const townArray = [
  'Reykjavík',
  'Akureyri',
  'Siglufjörður',
  'Egilsstaðir',
  'Ísafjörður',
]

const streetArray = [
  'Langagata',
  'Stuttagata',
  'Norðurgata',
  'Suðurgata',
  'Eldfjallagata',
]

export const stadfang = factory<types.Stadfang>({
  stadfanganr: () => faker.helpers.replaceSymbolWithNumber('s???', '?'),
  sveitarfelag: () => faker.random.arrayElement(townArray),
  postnr: () => faker.random.number(800),
  stadvisir: () => faker.random.arrayElement(streetArray),
  stadgreinir: () => faker.random.number(99).toString(),
  landeignarnr: () => faker.helpers.replaceSymbolWithNumber('L????', '?'),
  display() {
    return `${this.stadvisir} ${this.stadgreinir}, ${this.sveitarfelag}`
  },
  displayShort() {
    return `${this.stadvisir} ${this.stadgreinir}`
  },
})

export const fasteign = factory<types.Fasteign>({
  fasteignanr: () => faker.helpers.replaceSymbolWithNumber('F?????', '?'),
  sjalfgefidStadfang: () => stadfang(),
})

export const fasteignamat = factory<types.Fasteignamat>({
  gildandi: () => faker.random.number({ min: 20000000, max: 50000000 }),
  gildandiAr: new Date().getFullYear().toString(),
  fyrirhugad() {
    return this.gildandi + 1500000 // Optional
  },
  fyrirhugadAr: (new Date().getFullYear() + 1).toString(), // Optional
})

export const eigandi = factory<types.ThinglysturEigandi>({
  nafn: () => faker.name.findName(),
  kennitala: '0000000000',
  eignarhlutfall: 0.5,
  kaupdagur: () => faker.date.past(),
  heimild: 'xyz',
  display: '50.00%',
})

export const notkunareining = factory<types.Notkunareining>({
  notkunareininganr: () => faker.helpers.replaceSymbolWithNumber('N?', '?'),
  fasteignanr: () => faker.helpers.replaceSymbolWithNumber('F?????', '?'),
  stadfang: () => stadfang(),
  merking: () => faker.helpers.replaceSymbolWithNumber('Íbúð ?', '?'),
  notkun: () => faker.helpers.replaceSymbolWithNumber('Notkun ?', '?'),
  starfsemi: () => faker.helpers.replaceSymbolWithNumber('Starfsemi ?', '?'),
  lysing: () => faker.helpers.replaceSymbolWithNumber('Lýsing ?', '?'),
  byggingarAr: 2008,
  birtStaerd: () => faker.finance.amount(100, 250, 1),
  fasteignamat: () => fasteignamat(),
  lodarmat: () => faker.random.number({ min: 1000000, max: 5000000 }),
  brunabotamat: faker.random.number({
    min: 20000000,
    max: 40000000,
  }),
})

export const assetDetail = factory<types.Fasteign>({
  ...fasteign(),
  fasteignamat: () => fasteignamat(),
  thinglystirEigendur: eigandi.list(2),
  notkunareiningar: {
    data: notkunareining.list(2),
    paging: {
      page: 2,
      pageSize: 5,
      total: 20,
      totalPages: 4,
      offset: 10,
      hasPreviousPage: true,
      hasNextPage: false,
    },
  },
})
