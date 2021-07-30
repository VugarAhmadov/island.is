import * as z from 'zod'
import { error } from './messages/error'
import * as kennitala from 'kennitala'
import {
  AccidentTypeEnum,
  AgricultureAccidentLocationEnum,
  AttachmentsEnum,
  FishermanWorkplaceAccidentLocationEnum,
  GeneralWorkplaceAccidentLocationEnum,
  PowerOfAttorneyUploadEnum,
  ProfessionalAthleteAccidentLocationEnum,
  RescueWorkAccidentLocationEnum,
  StudiesAccidentLocationEnum,
  WhoIsTheNotificationForEnum,
  WorkAccidentTypeEnum,
} from '../types'
import { isValid24HFormatTime } from '../utils'
import { NO, YES } from '../constants'

export enum OnBehalf {
  MYSELF = 'myself',
  OTHERS = 'others',
}

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

export const AccidentNotificationSchema = z.object({
  externalData: z.object({
    nationalRegistry: z.object({
      data: z.object({
        address: z.object({
          city: z.string(),
          code: z.string(),
          postalCode: z.string(),
          streetAddress: z.string(),
        }),
        age: z.number(),
        citizenship: z.object({
          code: z.string(),
          name: z.string(),
        }),
        fullName: z.string(),
        legalResidence: z.string(),
        nationalId: z.string(),
      }),
      date: z.string(),
      status: z.enum(['success', 'failure']),
    }),
    userProfile: z.object({
      data: z.object({
        email: z.string(),
        mobilePhoneNumber: z.string(),
      }),
      date: z.string(),
      status: z.enum(['success', 'failure']),
    }),
  }),
  approveExternalData: z.boolean().refine((p) => p),
  info: z.object({
    onBehalf: z.enum([OnBehalf.MYSELF, OnBehalf.OTHERS]),
  }),
  applicant: z.object({
    name: z.string().min(1, error.required.defaultMessage),
    nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false)),
    address: z.string().min(1, error.required.defaultMessage),
    postalCode: z.string().min(1, error.required.defaultMessage),
    city: z.string().min(1, error.required.defaultMessage),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
  }),
  whoIsTheNotificationFor: z.object({
    answer: z.enum([
      WhoIsTheNotificationForEnum.JURIDICALPERSON,
      WhoIsTheNotificationForEnum.ME,
      WhoIsTheNotificationForEnum.POWEROFATTORNEY,
    ]),
  }),
  attachments: z.object({
    injuryCertificate: z.enum([
      AttachmentsEnum.HOSPITALSENDSCERTIFICATE,
      AttachmentsEnum.INJURYCERTIFICATE,
      AttachmentsEnum.SENDCERTIFICATELATER,
    ]),
    injuryCertificateFile: z.array(FileSchema).optional(),
    deathCertificateFile: z.array(FileSchema).optional(),
  }),
  wasTheAccidentFatal: z.enum([YES, NO]),
  fatalAccidentUploadDeathCertificateNow: z.enum([YES, NO]),
  accidentDetails: z.object({
    dateOfAccident: z.string().min(1),
    timeOfAccident: z
      .string()
      .refine((x) => (x ? isValid24HFormatTime(x) : false)),
    descriptionOfAccident: z.string().min(1),
  }),
  isRepresentativeOfCompanyOrInstitue: z.enum([YES, NO]),
  companyInfo: z.object({
    nationalRegistrationId: z.string().optional(),
    descriptionField: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
  locationAndPurpose: z.object({
    location: z.string().min(1),
    purpose: z.string().min(1),
  }),
  accidentLocation: z.object({
    answer: z.enum([
      GeneralWorkplaceAccidentLocationEnum.ATTHEWORKPLACE,
      GeneralWorkplaceAccidentLocationEnum.TOORFROMTHEWORKPLACE,
      GeneralWorkplaceAccidentLocationEnum.OTHER,
      FishermanWorkplaceAccidentLocationEnum.ONTHESHIP,
      FishermanWorkplaceAccidentLocationEnum.TOORFROMTHEWORKPLACE,
      FishermanWorkplaceAccidentLocationEnum.OTHER,
      ProfessionalAthleteAccidentLocationEnum.SPORTCLUBSFACILITES,
      ProfessionalAthleteAccidentLocationEnum.TOORFROMTHESPORTCLUBSFACILITES,
      ProfessionalAthleteAccidentLocationEnum.OTHER,
      AgricultureAccidentLocationEnum.ATTHEWORKPLACE,
      AgricultureAccidentLocationEnum.TOORFROMTHEWORKPLACE,
      RescueWorkAccidentLocationEnum.TOORFROMRESCUE,
      RescueWorkAccidentLocationEnum.DURINGRESCUE,
      RescueWorkAccidentLocationEnum.OTHER,
      StudiesAccidentLocationEnum.ATTHESCHOOL,
      StudiesAccidentLocationEnum.DURINGSTUDIES,
      StudiesAccidentLocationEnum.OTHER,
    ]),
  }),
  accidentType: z.object({
    radioButton: z.enum([
      AccidentTypeEnum.WORK,
      AccidentTypeEnum.HOMEACTIVITIES,
      AccidentTypeEnum.RESCUEWORK,
      AccidentTypeEnum.SPORTS,
      AccidentTypeEnum.STUDIES,
    ]),
  }),

  workAccident: z.object({
    type: z
      .enum([
        WorkAccidentTypeEnum.AGRICULTURE,
        WorkAccidentTypeEnum.FISHERMAN,
        WorkAccidentTypeEnum.GENERAL,
        WorkAccidentTypeEnum.PROFESSIONALATHLETE,
      ])
      .optional(),
  }),
  injuredPersonInformation: z.object({
    name: z.string().min(1, error.required.defaultMessage),
    nationalId: z.string().refine((x) => (x ? kennitala.isPerson(x) : false)),
    address: z.string().min(1, error.required.defaultMessage),
    postalCode: z.string().min(1, error.required.defaultMessage),
    city: z.string().min(1, error.required.defaultMessage),
    email: z.string().email().min(1, error.required.defaultMessage),
    phoneNumber: z.string().min(1, error.required.defaultMessage),
  }),
  powerOfAttorney: z.object({
    type: z.enum([
      PowerOfAttorneyUploadEnum.FORCHILDINCUSTODY,
      PowerOfAttorneyUploadEnum.UPLOADLATER,
      PowerOfAttorneyUploadEnum.UPLOADNOW,
    ]),
  }),
})

export type AccidentNotification = z.TypeOf<typeof AccidentNotificationSchema>
