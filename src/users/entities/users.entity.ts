/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
// Caminho: src/users/entities/users.entity.ts

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
  OneToOne,
} from 'typeorm';
import { UserRole } from 'src/users/enums/users-role.enum';
import { UserStatus } from 'src/users/enums/users-status.enum';
import * as bcrypt from 'bcrypt';
import { RequestingUnit } from 'src/requesting-units/entities/requesting-unit.entity';
import { ForensicService } from 'src/forensic-services/entities/forensic-service.entity';
import { Exclude, Expose, Type } from 'class-transformer'; // Garanta que 'Type' está importado
import { Authority } from 'src/authorities/entities/authority.entity';

@Entity('users')
@Unique(['email'])
@Unique(['cpf'])
export class User {
  @Expose() // Permite que este campo seja enviado
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose() // Permite que este campo seja enviado
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Expose() // Permite que este campo seja enviado
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Expose() // Permite que este campo seja enviado
  @Column({ type: 'varchar', length: 11 })
  cpf: string;

  @Expose() // Permite que este campo seja enviado
  @Column({ type: 'varchar', length: 15, nullable: true })
  phone: string;
  
  @Exclude() // Garante que a senha NUNCA seja enviada
  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Expose() // Permite que este campo seja enviado
  @Column({ type: 'varchar', nullable: true })
  institution: string | null;

  @Expose() // Permite que este campo seja enviado
  @Column({ type: 'enum', enum: UserRole, nullable: true})
  role: UserRole;

  @Expose() // Permite que este campo seja enviado
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Expose() // Permite que este campo seja enviado
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
  
  @Expose() // Permite que estes relacionamentos sejam enviados
  @Type(() => RequestingUnit) // Ajuda a transformar o objeto
  @ManyToMany(() => RequestingUnit, (requestingUnit) => requestingUnit.users)
  @JoinTable({
    name: 'users_requesting_units',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'requesting_unit_id', referencedColumnName: 'id' },
  })
  requestingUnits: RequestingUnit[];
  
  @Expose() // Permite que estes relacionamentos sejam enviados
  @Type(() => ForensicService) // Ajuda a transformar o objeto
  @ManyToMany(() => ForensicService, (service) => service.users)
  @JoinTable({
    name: 'users_forensic_services',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'forensic_service_id', referencedColumnName: 'id' },
  })
  forensicServices: ForensicService[];
  
  @OneToOne(() => Authority, (authority) => authority.user)
  authority: Authority; //
  
  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}