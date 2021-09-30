import { NationalRegistryResidence } from '../../models/nationalRegistryResidence.model'
import { DAY } from './constants'

/**
 * Compute a summary of how many days you've spent as a resident of each country in
 * the last 365 days
 *
 * @param history list from national id registry of residences
 * @returns map of country code to days spent in country in the last 365 days
 */
export const computeCountryResidence = (
  history: NationalRegistryResidence[],
) => {
  if (history.length < 1) {
    return null
  }

  const simplified = history
    .map(({ dateOfChange, country }) => ({
      time: dateOfChange.getTime(),
      country,
    }))
    .sort(({ time: a }, { time: b }) => {
      // reversed order, make sure we get this right even if the national ID
      // registry is out of order
      return b - a
    })

  const currentDateTime = new Date()

  const now = new Date(
    currentDateTime.getFullYear(),
    currentDateTime.getMonth(),
    currentDateTime.getDate(),
  ).getTime()

  const yearAgo = new Date(
    currentDateTime.getFullYear() - 1,
    currentDateTime.getMonth(),
    currentDateTime.getDate(),
  ).getTime()

  let lastTime = now
  let i = 0
  let current = Number.MAX_SAFE_INTEGER

  const timeByCountry: Record<string, number> = {}

  while (current > yearAgo && simplified[i]) {
    const { time, country } = simplified[i]
    current = Math.max(time, yearAgo)
    const period = Math.round((lastTime - current) / DAY)
    timeByCountry[country] = (timeByCountry[country] || 0) + period
    lastTime = current
    i++
  }

  return timeByCountry
}
