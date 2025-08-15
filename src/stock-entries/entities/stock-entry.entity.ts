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

@Entity('stock_entries')
export class StockEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relacionamentos ---
  @ManyToOne(() => StockItem, { onDelete: 'RESTRICT' }) // Não deixa apagar um item do catálogo se ele tiver entradas
  @JoinColumn({ name: 'stock_item_id' })
  stockItem: StockItem;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User; // O usuário que registrou a entrada

  // --- Dados do Lote ---
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number; // Quantidade que entrou

  @Column({ nullable: true })
  lotNumber?: string; // Número do lote do fabricante

  @Column({ type: 'date', nullable: true })
  expirationDate?: Date; // Data de validade do lote

  @Column({ type: 'timestamp' })
  entryDate: Date; // Data em que o item entrou no estoque

  // --- Auditoria ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}