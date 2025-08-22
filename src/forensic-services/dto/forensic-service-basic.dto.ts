// Caminho: src/forensic-services/dto/forensic-service-basic.dto.ts

import { Expose } from "class-transformer";

export class ForensicServiceBasicDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
