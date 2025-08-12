import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('occurrence_classifications')
export class OccurrenceClassification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string; // Ex: "001.1", "ATVF"

  @Column()
  name: string; // Ex: "Acidente de Trânsito com Vítima Fatal"

  @Column({ nullable: true })
  group: string; // Opcional: "Acidentes de Trânsito"

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}