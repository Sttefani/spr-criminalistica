/* eslint-disable prettier/prettier */
// File: src/cities/entities/city.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
} from 'typeorm';

@Entity('cities')
@Unique(['name', 'state']) // Ensures no duplicate city names within the same state
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 2, default: 'RR' }) // Add default: 'RR'
  state: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn() // Enables soft delete for cities
  deletedAt: Date;
}