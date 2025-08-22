// Caminho: src/requesting-units/dto/requesting-unit-basic.dto.ts

import { Expose } from "class-transformer";

export class RequestingUnitBasicDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
