// Arquivo: src/common/seeds/admin-user-seed.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { UserRole } from 'src/users/enums/users-role.enum';
import { UserStatus } from 'src/users/enums/users-status.enum';

@Injectable()
export class AdminUserSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const adminEmail = 'admin@sistema.com';

    const existingAdmin = await this.usersRepository.findOneBy({
      email: adminEmail,
    });

    if (!existingAdmin) {
      console.log('Nenhum Super Admin encontrado. Criando usuário semente...');
      
      const adminUser = this.usersRepository.create({
        name: 'Super Administrador',
        email: adminEmail,
        password: 'admin', // A senha será criptografada pelo hook @BeforeInsert
        cpf: '00000000000',
        role: UserRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE, // Já nasce ativo
      });

      await this.usersRepository.save(adminUser);
      console.log('Super Admin criado com sucesso!');
      console.log('Email: admin@sistema.com');
      console.log('Senha: admin');
    }
  }
}