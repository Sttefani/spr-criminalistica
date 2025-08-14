// Arquivo: src/patrimony-movements/patrimony-movements.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatrimonyMovementDto } from './dto/create-patrimony-movement.dto';
import { PatrimonyMovement } from './entities/patrimony-movement.entity';
import { Location } from 'src/locations/entities/location.entity';
import { User } from 'src/users/entities/users.entity';
import { MovementType } from './enums/movement-type.enum';
import {PatrimonyItem } from 'src/patrimony-items/entities/patrimony-item.entity';
import { ItemOperationalStatus } from 'src/patrimony-items/enums/item-operational-status.enum';
// Mude para:

@Injectable()
export class PatrimonyMovementsService {
  constructor(
    @InjectRepository(PatrimonyMovement)
    private movementsRepository: Repository<PatrimonyMovement>,
    @InjectRepository(PatrimonyItem)
    private itemsRepository: Repository<PatrimonyItem>,
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createDto: CreatePatrimonyMovementDto, responsibleAdmin: User): Promise<PatrimonyMovement> {
    const { patrimonyItemId, type, toLocationId, toUserId, notes } = createDto;

    // 1. Busca o item patrimonial e suas relações atuais
    const item = await this.itemsRepository.findOne({
      where: { id: patrimonyItemId },
      relations: ['currentLocation', 'currentHolder'],
    });
    if (!item) {
      throw new NotFoundException(`Item patrimonial com o ID "${patrimonyItemId}" não encontrado.`);
    }

    // 2. Prepara o registro de movimentação
    const newMovement = this.movementsRepository.create({
      patrimonyItem: item,
      type,
      notes,
      responsibleAdmin,
      fromLocation: item.currentLocation, // Origem é o estado atual
      fromUser: item.currentHolder,       // Origem é o estado atual
    });

    // 3. Lida com a lógica de cada tipo de movimento
    if (type === MovementType.TRANSFER) {
      if (!toLocationId && !toUserId) {
        throw new BadRequestException('Para uma transferência, é necessário informar um local ou um responsável de destino.');
      }
      if (toLocationId) {
        const toLocation = await this.locationsRepository.findOneBy({ id: toLocationId });
        if (!toLocation) throw new NotFoundException(`Localização de destino com ID "${toLocationId}" não encontrada.`);
        newMovement.toLocation = toLocation;
        item.currentLocation = toLocation; // Atualiza o item
      }
      if (toUserId) {
        const toUser = await this.usersRepository.findOneBy({ id: toUserId });
        if (!toUser) throw new NotFoundException(`Usuário de destino com ID "${toUserId}" não encontrado.`);
        newMovement.toUser = toUser;
        item.currentHolder = toUser; // Atualiza o item
      } else {
        item.currentHolder = null; // Se moveu para um local, não está mais com um usuário
      }
    } else if (type === MovementType.MAINTENANCE_START) {
      item.operationalStatus = ItemOperationalStatus.IN_MAINTENANCE;
    } else if (type === MovementType.MAINTENANCE_END) {
      item.operationalStatus = ItemOperationalStatus.OPERATIONAL;
    } else if (type === MovementType.RETIREMENT) {
      item.operationalStatus = ItemOperationalStatus.RETIRED;
      item.currentHolder = null; // Item baixado não tem responsável
    }

    // 4. Salva o item e o movimento em uma transação
    await this.itemsRepository.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(item);
      await transactionalEntityManager.save(newMovement);
    });

    return newMovement;
  }

  /**
   * Lista o histórico de movimentações de um item específico (o "extrato").
   */
  async findAllByItem(patrimonyItemId: string): Promise<PatrimonyMovement[]> {
    return this.movementsRepository.find({
      where: { patrimonyItem: { id: patrimonyItemId } },
      relations: ['fromLocation', 'toLocation', 'fromUser', 'toUser', 'responsibleAdmin'],
      order: { movementDate: 'DESC' }, // Ordena do mais recente para o mais antigo
    });
  }
}