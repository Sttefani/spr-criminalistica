/* eslint-disable prettier/prettier */
// Arquivo: src/authorities/entities/authority.entity.ts

import { User } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('authorities')
export class Authority {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Ex: "Carlos Eduardo da Silva"

  @Column()
  title: string; // Ex: "Delegado de Polícia", "Juiz de Direito", "Promotor de Justiça"

  // Este é o relacionamento opcional com a tabela de usuários.
  // Ele nos permite saber se esta autoridade também é um usuário do sistema.
  @OneToOne(() => User, { nullable: true }) // eager: true carrega o usuário automaticamente
  @JoinColumn({ name: 'user_id' })
  user?: User; // O '?' e nullable: true tornam o relacionamento opcional

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}