// Arquivo: src/patrimony-items/patrimony-items.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatrimonyItemDto } from './dto/create-patrimony-item.dto';
import { UpdatePatrimonyItemDto } from './dto/update-patrimony-item.dto';
import { PatrimonyItem } from './entities/patrimony-item.entity';
import { Location } from 'src/locations/entities/location.entity';
import { User } from 'src/users/entities/users.entity';
import { PatrimonySubcategory } from 'src/patrimony-classifications/entities/patrimony-subcategory.entity';

@Injectable()
export class PatrimonyItemsService {
  [x: string]: any;
  delete(id: string, currentUser: User) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(PatrimonyItem)
    private itemsRepository: Repository<PatrimonyItem>,
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PatrimonySubcategory) // 1. INJETA O NOVO REPOSITÓRIO
    private subcategoryRepository: Repository<PatrimonySubcategory>,
  ) {}

  async create(createDto: CreatePatrimonyItemDto): Promise<PatrimonyItem> {
    const { currentLocationId, currentHolderId, subcategoryId, ...itemData } = createDto;

    // 2. VALIDA A SUBCATEGORIA
    const subcategory = await this.subcategoryRepository.findOneBy({ id: subcategoryId });
    if (!subcategory) {
      throw new NotFoundException(`Subcategoria com o ID "${subcategoryId}" não encontrada.`);
    }

    const location = await this.locationsRepository.findOneBy({ id: currentLocationId });
    if (!location) throw new NotFoundException(`Localização com o ID "${currentLocationId}" não encontrada.`);

    let holder: User | null = null;
    if (currentHolderId) {
      holder = await this.usersRepository.findOneBy({ id: currentHolderId });
      if (!holder) throw new NotFoundException(`Usuário responsável com o ID "${currentHolderId}" não encontrado.`);
    }

    const newItem = new PatrimonyItem();
    Object.assign(newItem, itemData);
    newItem.subcategory = subcategory; // 3. ASSOCIA A SUBCATEGORIA
    newItem.currentLocation = location;
    newItem.currentHolder = holder;

    try {
      return await this.itemsRepository.save(newItem);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Um item com este número de tombo já existe.');
      }
      throw error;
    }
  }

  async findAll(): Promise<PatrimonyItem[]> {
    return this.itemsRepository.find({
      relations: {
        subcategory: {
          category: true, // Carrega a categoria da subcategoria
        },
        currentLocation: true,
        currentHolder: true,
      },
    });
  }
  async findOne(id: string): Promise<PatrimonyItem> {
    const item = await this.itemsRepository.findOne({
      where: { id },
      relations: {
        subcategory: {
          category: true,
        },
        currentLocation: true,
        currentHolder: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`Item patrimonial com o ID "${id}" não encontrado.`);
    }
    return item;
  }
  async update(id: string, updateDto: UpdatePatrimonyItemDto): Promise<PatrimonyItem> {
    const { currentLocationId, currentHolderId, subcategoryId, ...itemData } = updateDto;

    const item = await this.findOne(id);
    Object.assign(item, itemData);

    // 4. LÓGICA PARA ATUALIZAR A SUBCATEGORIA
    if (subcategoryId) {
      const subcategory = await this.subcategoryRepository.findOneBy({ id: subcategoryId });
      if (!subcategory) throw new NotFoundException(`Subcategoria com o ID "${subcategoryId}" não encontrada.`);
      item.subcategory = subcategory;
    }

    if (currentLocationId) {
      const location = await this.locationsRepository.findOneBy({ id: currentLocationId });
      if (!location) throw new NotFoundException(`Localização com o ID "${currentLocationId}" não encontrada.`);
      item.currentLocation = location;
    }
    if (currentHolderId === null) {
      item.currentHolder = null;
    } else if (currentHolderId) {
      const holder = await this.usersRepository.findOneBy({ id: currentHolderId });
      if (!holder) throw new NotFoundException(`Usuário responsável com o ID "${currentHolderId}" não encontrado.`);
      item.currentHolder = holder;
    }

    try {
      return await this.itemsRepository.save(item);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Um item com este número de tombo já existe.');
      }
      throw error;
    }
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const result = await this.itemsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Item patrimonial com o ID "${id}" não encontrado.`);
    }
  }
}