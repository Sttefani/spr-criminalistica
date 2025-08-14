import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PatrimonyCategory } from './patrimony-category.entity';

@Entity('patrimony_subcategories')
export class PatrimonySubcategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Ex: "Computadores e Periféricos"

  @ManyToOne(() => PatrimonyCategory, (category) => category.subcategories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: PatrimonyCategory;
}