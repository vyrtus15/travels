import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiParam, ApiPropertyOptional, ApiPropertyOptions, getSchemaPath } from '@nestjs/swagger';
import { RoleType } from '../common/roleType';

export const ApiUserParam: (name: string) => MethodDecorator =
  (name) =>
    (target, propertyKey, descriptor) =>
      ApiParam({ name, type: 'string', description: 'user id' })(target, propertyKey, descriptor);

export const ApiTravelParam: (name: string) => MethodDecorator =
  (name) =>
    (target, propertyKey, descriptor) =>
      ApiParam({ name, type: 'string', description: 'travel record id' })(target, propertyKey, descriptor);

export const ApiOperationFor: (description: string, ...roles: RoleType[]) => MethodDecorator =
  (description, ...roles) =>
    (target, propertyKey, descriptor) =>
      ApiOperation({
        description: `${description}<br/><br/>Allowed only for roles: ${roles.map(x => '`' + x + '`').join(',')}.`,
      })(target, propertyKey, descriptor);

export const ApiUserForbiddenResponse: () => MethodDecorator =
  () =>
    (target, propertyKey, descriptor) =>
      ApiForbiddenResponse({ description: 'Insufficient rights to access the user.' })(target, propertyKey, descriptor);

export const ApiTravelsForbiddenResponse: () => MethodDecorator =
  () =>
    (target, propertyKey, descriptor) =>
      ApiForbiddenResponse({ description: 'Insufficient rights to access the user\'s travels record(s).' })(target, propertyKey, descriptor);

export const ApiSortProperty: (options: ApiPropertyOptions) => PropertyDecorator =
  (options) =>
    (target, propertyKey) =>
      ApiPropertyOptional({
        description: 'Sort field. A `-` sign in front of the field indicates descending order.',
        ...options,
      })(target, propertyKey);

export const ApiPageOkResponse: (itemType) => MethodDecorator =
  (itemType) =>
    (target, propertyKey, descriptor) => ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          page: { type: 'integer' },
          limit: { type: 'integer' },
          total: { type: 'integer' },
          items: { type: 'array', items: { $ref: getSchemaPath(itemType) } }
        }
      }
    })(target, propertyKey, descriptor);
