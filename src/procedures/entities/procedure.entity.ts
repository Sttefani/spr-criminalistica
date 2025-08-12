// Arquivo: src/procedures/entities/procedure.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
// A linha abaixo causará um erro de compilação por enquanto,
// porque a entidade Occurrence ainda não existe. Isso é esperado.
// Vamos ignorar este erro por agora e descomentá-la no futuro.
// import { Occurrence } from 'src/occurrences/entities/occurrence.entity';

@Entity('procedures')
export class Procedure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // Ex: "Inquérito Policial Militar"

  @Column({ unique: true })
  acronym: string; // Ex: "IPM"

  // --- RELACIONAMENTO (TEMPORARIAMENTE COMENTADO) ---
  // Descomentaremos estas linhas quando criarmos o módulo de Ocorrências.
  // @OneToMany(() => Occurrence, (occurrence) => occurrence.procedure)
  // occurrences: Occurrence[];
  // --- FIM DO RELACIONAMENTO ---

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}