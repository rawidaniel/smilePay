import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsBigIntConstraint } from '../validators/isBigInt.validator';

export function IsBigInt(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isBigInt',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBigIntConstraint,
    });
  };
}
