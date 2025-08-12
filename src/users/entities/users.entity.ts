// Arquivo: src/users/entities/users.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  Unique,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserRole } from 'src/users/enums/users-role.enum'; // Caminho corrigido
import { UserStatus } from 'src/users/enums/users-status.enum'; // Caminho corrigido
import * as bcrypt from 'bcrypt';
import { RequestingUnit } from 'src/requesting-units/entities/requesting-unit.entity';
import { ForensicService } from 'src/forensic-services/entities/forensic-service.entity';

@Entity('users')
@Unique(['email'])
@Unique(['cpf'])
export class User { // A CLASSE COMEÇA AQUI
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 11 })
  cpf: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, nullable: true})
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
  
  // --- Relacionamento 1 ---
  @ManyToMany(() => RequestingUnit, (requestingUnit) => requestingUnit.users)
  @JoinTable({
    name: 'users_requesting_units',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'requesting_unit_id', referencedColumnName: 'id' },
  })
  requestingUnits: RequestingUnit[];
  
  // --- Relacionamento 2 ---
  @ManyToMany(() => ForensicService, (service) => service.users)
  @JoinTable({
    name: 'users_forensic_services',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'forensic_service_id', referencedColumnName: 'id' },
  })
  forensicServices: ForensicService[];
  
  // --- O MÉTODO @BeforeInsert() DENTRO DA CLASSE ---
  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

} // A CLASSE TERMINA AQUI