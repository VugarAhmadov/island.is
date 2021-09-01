import { FormValue } from '@island.is/application/core'
import { YES } from '../constants'
import { AccidentTypeEnum, WorkAccidentTypeEnum } from '../types'
import { getWorkplaceData } from './getWorkplaceData'

describe('getWorkplaceData', () => {
  const generalWorkplaceAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.GENERAL },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
    companyInfo: {},
  }

  const professionalAthleteAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.SPORTS },
    sportsClubInfo: { employee: { radioButton: YES } },
  }

  const rescueWorkAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.RESCUEWORK },
  }

  const studiesAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.STUDIES },
  }

  const fishermanAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.FISHERMAN },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
  }

  const emptyObject = {}

  it('should return general work type data for general work accidents', () => {
    expect(getWorkplaceData(generalWorkplaceAccident)?.type).toEqual(
      AccidentTypeEnum.WORK,
    )
  })

  it('should return sports type data for professional athlete accidents', () => {
    expect(getWorkplaceData(professionalAthleteAccident)?.type).toEqual(
      AccidentTypeEnum.SPORTS,
    )
  })

  it('should return employee information for professional athlete accidents', () => {
    expect(
      getWorkplaceData(professionalAthleteAccident)?.info.employee?.radioButton,
    ).toBe(YES)
  })

  it('should not return employee information for general workplace accident', () => {
    expect(getWorkplaceData(generalWorkplaceAccident)?.info.employee).toBe(
      undefined,
    )
  })

  it('should return rescue work type data for rescue work accidents', () => {
    expect(getWorkplaceData(rescueWorkAccident)?.type).toEqual(
      AccidentTypeEnum.RESCUEWORK,
    )
  })

  it('should return studies type data for student accidents', () => {
    expect(getWorkplaceData(studiesAccident)?.type).toEqual(
      AccidentTypeEnum.STUDIES,
    )
  })

  it('should return fisherman type data for fisherman accidents', () => {
    expect(getWorkplaceData(fishermanAccident)?.type).toEqual(
      WorkAccidentTypeEnum.FISHERMAN,
    )
  })

  it('should return undefined for empty object', () => {
    expect(getWorkplaceData(emptyObject)?.type).toEqual(undefined)
  })
})
