// Arquivo: src/stock-items/entities/stock-item.entity.ts

import { StockEntry } from 'src/stock-entries/entities/stock-entry.entity';
import { StockUsage } from 'src/stock-usages/entities/stock-usage.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('stock_items')
export class StockItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // Ex: "Kit de Extração de DNA XYZ", "Luvas Descartáveis (Caixa)"

  @Column({ type: 'text', nullable: true })
  description?: string;
  
  // --- CAMPO DE CATEGORIA (MAIS FLEXÍVEL) ---
  @Column()
  category: string; // Ex: "Reagentes de Genética", "Vidraria", "EPIs", "Consumíveis de Balística"

  @Column()
  unitOfMeasure: string; // Ex: "unidade", "caixa", "litro", "kg"

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.30 })
  safetyMargin: number; // Margem de Segurança (padrão 30%)

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentStock: number; // Estoque Atual (calculado)
  
  // --- CAMPO DINÂMICO ---
  @Column({ type: 'jsonb', nullable: true })
  additionalFields?: any; // Ex: { "fornecedor_preferencial": "ACME Corp", "condicao_armazenamento": "Refrigerado" }

  @OneToMany(() => StockEntry, (entry) => entry.stockItem)
  entries: StockEntry[];

  @OneToMany(() => StockUsage, (usage) => usage.stockItem)
  usages: StockUsage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}