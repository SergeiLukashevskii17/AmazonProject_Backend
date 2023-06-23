import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ValidationException } from "src/exception/validation.exception";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj = plainToClass(metadata.metatype, value); // ну тут мы типа как-то получили body
    const errors = await validate(obj);

    if (errors.length) {
      let messages = errors.map(
        (error) =>
          `${error.property}: ${Object.values(error.constraints).join(", ")}` // тут мы просто по красоте разбираем массив ошибок и формируем удобную для пользователя строку ошибок
      );
      throw new ValidationException(messages);
    }

    return value;
  }
}
