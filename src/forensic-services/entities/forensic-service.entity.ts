/* eslint-disable prettier/prettier */
// Arquivo: src/forensic-services/entities/forensic-service.entity.ts

import { User } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm';

@Entity('forensic_services')
export class ForensicService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // Ex: "Genética Forense"

  @Column({ unique: true })
  acronym: string; // Ex: "GEN"

  // Este é o lado "inverso" do relacionamento. A entidade User será a "dona".
  // Apenas informamos ao TypeORM que este serviço pode ter muitos usuários.
  @ManyToMany(() => User, (user) => user.forensicServices)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}