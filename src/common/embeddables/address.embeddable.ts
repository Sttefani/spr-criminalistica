// Arquivo: src/common/embeddables/address.embeddable.ts

import { Column } from 'typeorm';

// A classe não usa @Entity(), mas sim @Embeddable() que importaremos depois
// Por enquanto, apenas a classe com os campos
export class Address {
  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  number?: string;

  @Column({ nullable: true })
  neighborhood?: string;

  @Column({ nullable: true })
  zipCode?: string;

  @Column({ type: 'text', nullable: true })
  referencePoint?: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number;
}