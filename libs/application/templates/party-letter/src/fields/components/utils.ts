import { Endorsement } from '../../types/schema'

export const PAGE_SIZE = 10

export function paginate(
  endorsements: Endorsement[] | undefined,
  pageSize: number,
  pageNumber: number,
) {
  if (endorsements === undefined) return
  else {
    return endorsements.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize,
    )
  }
}

export function totalPages(endorsementsLength: number | undefined) {
  if (endorsementsLength === undefined) return 0
  else {
    return Math.ceil(endorsementsLength / PAGE_SIZE)
  }
}
