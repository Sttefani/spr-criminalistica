/* eslint-disable prettier/prettier */
// Arquivo: src/requesting-units/entities/requesting-unit.entity.ts

import { User } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
  ManyToMany,
} from 'typeorm';

@Entity('requesting_units')
@Unique(['name']) // Nome da unidade deve ser único
export class RequestingUnit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string; // Ex: "Delegacia Geral de Homicídios"

  @Column({ type: 'varchar', length: 50 })
  acronym: string; // Ex: "DGH"

  // --- LADO INVERSO DO RELACIONAMENTO ---
  // Apenas informamos ao TypeORM que existe um relacionamento,
  // mas não usamos o @JoinTable aqui.
  @ManyToMany(() => User, (user) => user.requestingUnits)
  users: User[];
  // --- FIM DO RELACIONAMENTO ---

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()

  deletedAt: Date;
}