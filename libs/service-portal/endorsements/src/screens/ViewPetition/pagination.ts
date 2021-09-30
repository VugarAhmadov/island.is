export const PAGE_SIZE = 3

export function paginate(petitions: any, pageSize: number, pageNumber: number) {
  if (petitions === undefined) return
  else {
    return petitions.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
  }
}

export function pages(petitionsLength: number) {
  if (petitionsLength === undefined) return 0
  else {
    return Math.ceil(petitionsLength / PAGE_SIZE)
  }
}
