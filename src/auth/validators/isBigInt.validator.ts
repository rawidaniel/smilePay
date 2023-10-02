import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsBigIntConstraint implements ValidatorConstraintInterface {
  //   validate(value: any, args: ValidationArguments): boolean {
  validate(value: any): boolean {
    try {
      BigInt(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a bigint value.`;
  }
}
