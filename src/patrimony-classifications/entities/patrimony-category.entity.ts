import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PatrimonySubcategory } from './patrimony-subcategory.entity';

@Entity('patrimony_categories')
export class PatrimonyCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // Ex: "Equipamentos de Informática"

  @OneToMany(() => PatrimonySubcategory, (subcategory) => subcategory.category)
  subcategories: PatrimonySubcategory[];
}