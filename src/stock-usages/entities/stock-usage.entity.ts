// Arquivo: src/stock-usages/entities/stock-usage.entity.ts

import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { StockItem } from 'src/stock-items/entities/stock-item.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('stock_usages')
export class StockUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relacionamentos ---
  @ManyToOne(() => StockItem, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'stock_item_id' })
  stockItem: StockItem; // Qual item foi usado

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User; // Quem usou/registrou a saída

  // Relacionamento opcional com a ocorrência onde o item foi usado
  @ManyToOne(() => GeneralOccurrence, { nullable: true })
  @JoinColumn({ name: 'occurrence_id' })
  relatedOccurrence: GeneralOccurrence | null;

  // --- Dados do Uso ---
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantityUsed: number; // Quantidade que saiu

  @Column({ type: 'timestamp' })
  usageDate: Date; // Data em que o item foi usado

  // --- Auditoria ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}