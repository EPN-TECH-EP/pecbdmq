import { Injectable } from '@angular/core';
import {IApiService} from './ApiServiceFactoryImpl';
import ServiceTypeEnum from '../../../enum/service-type.enum';

export abstract class ApiServiceFactory {
  abstract createService(type: ServiceTypeEnum): IApiService;
}
