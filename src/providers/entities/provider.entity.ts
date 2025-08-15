// Arquivo: src/providers/entities/provider.entity.ts

import { Address } from 'src/common/embeddables/address.embeddable';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Nome/Razão Social

  @Column({ unique: true, nullable: true })
  cnpj?: string;

  // Reutilizando nossa Embeddable de endereço
  @Column(() => Address)
  address: Address;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  representativeName?: string; // Nome do representante/vendedor

  @Column({ type: 'text' })
  supplies: string; // O que fornece (ex: "Material de escritório, Reagentes Químicos")

  @Column({ type: 'jsonb', nullable: true })
  history?: any; // Histórico dinâmico (ex: { "2025-08-15": "Primeiro contato realizado", "2025-09-01": "Contrato assinado" })

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}