import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'

import { Injectable } from '@nestjs/common'

import {
  Application,
  Municipality,
  UpdateApplication,
  CreateApplication,
  GetSignedUrl,
  SignedUrl,
  ApplicationEvent,
  CreateApplicationEvent,
  ApplicationFilters,
} from '@island.is/financial-aid/shared'

import { environment } from '../environments'

@Injectable()
class BackendAPI extends RESTDataSource {
  baseURL = `${environment.backend.url}/api`

  willSendRequest(req: RequestOptions) {
    req.headers.set('authorization', this.context.req.headers.authorization)
    req.headers.set('cookie', this.context.req.headers.cookie)
  }

  getApplications(): Promise<Application[]> {
    return this.get('applications')
  }

  getApplication(id: string): Promise<Application> {
    return this.get(`applications/${id}`)
  }

  getApplicationFilters(): Promise<ApplicationFilters> {
    return this.get('applicationFilters')
  }

  getMunicipality(id: string): Promise<Municipality> {
    return this.get(`municipality/${id}`)
  }

  createApplication(
    createApplication: CreateApplication,
  ): Promise<Application> {
    return this.post('application', createApplication)
  }

  updateApplication(
    id: string,
    updateApplication: UpdateApplication,
  ): Promise<Application> {
    return this.put(`applications/${id}`, updateApplication)
  }

  getSignedUrl(getSignedUrl: GetSignedUrl): Promise<SignedUrl> {
    return this.post('/file/url', getSignedUrl)
  }

  getApplicationEvents(id: string): Promise<ApplicationEvent[]> {
    return this.get(`applicationEvents/${id}`)
  }

  createApplicationEvent(
    createApplicationEvent: CreateApplicationEvent,
  ): Promise<ApplicationEvent> {
    return this.post('applicationEvent', createApplicationEvent)
  }
}

export default BackendAPI
