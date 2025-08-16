// Arquivo: src/preliminary-drug-tests/preliminary-drug-tests.service.ts

import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreatePreliminaryDrugTestDto } from './dto/create-preliminary-drug-test.dto';
import { UpdatePreliminaryDrugTestDto } from './dto/update-preliminary-drug-test.dto';
import { SendToLabDto } from './dto/send-to-lab.dto';
import { PreliminaryDrugTest, CaseStatus } from './entities/preliminary-drug-test.entity';
import { User } from 'src/users/entities/users.entity';
import { Procedure } from 'src/procedures/entities/procedure.entity';
import { OccurrenceClassification } from 'src/occurrence-classifications/entities/occurrence-classification.entity';
import { RequestingUnit } from 'src/requesting-units/entities/requesting-unit.entity';
import { Authority } from 'src/authorities/entities/authority.entity';
import { City } from 'src/cities/entities/city.entity';
import { ForensicService } from 'src/forensic-services/entities/forensic-service.entity';
import { UserRole } from 'src/users/enums/users-role.enum';
import { DocumentsService } from 'src/documents/documents.service';
import { DocumentType } from 'src/documents/enums/document-type.enum';

@Injectable()
export class PreliminaryDrugTestsService {
  constructor(
    @InjectRepository(PreliminaryDrugTest)
    private pdtRepository: Repository<PreliminaryDrugTest>,
    @InjectRepository(Procedure) private procedureRepository: Repository<Procedure>,
    @InjectRepository(OccurrenceClassification) private classificationRepository: Repository<OccurrenceClassification>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(RequestingUnit) private unitRepository: Repository<RequestingUnit>,
    @InjectRepository(Authority) private authorityRepository: Repository<Authority>,
    @InjectRepository(City) private cityRepository: Repository<City>,
    @InjectRepository(ForensicService) private forensicServiceRepository: Repository<ForensicService>,
    
    // Injeção correta para a dependência circular
    @Inject(forwardRef(() => DocumentsService))
    private documentsService: DocumentsService,
  ) {}

  async create(createDto: CreatePreliminaryDrugTestDto, creatingUser: User): Promise<PreliminaryDrugTest> {
    // ... (seu método create está correto, não precisa mudar)
    const { procedureId, occurrenceClassificationId, responsibleExpertId, requestingUnitId, requestingAuthorityId, cityId, ...pdtData } = createDto;
    const procedure = await this.procedureRepository.findOneBy({ id: procedureId });
    if (!procedure) throw new NotFoundException(`Procedimento com ID ${procedureId} não encontrado.`);
    const classification = await this.classificationRepository.findOneBy({ id: occurrenceClassificationId });
    if (!classification) throw new NotFoundException(`Classificação com ID ${occurrenceClassificationId} não encontrada.`);
    const expert = await this.userRepository.findOneBy({ id: responsibleExpertId });
    if (!expert) throw new NotFoundException(`Perito com ID ${responsibleExpertId} não encontrado.`);
    const unit = await this.unitRepository.findOneBy({ id: requestingUnitId });
    if (!unit) throw new NotFoundException(`Unidade Demandante com ID ${requestingUnitId} não encontrada.`);
    const authority = await this.authorityRepository.findOneBy({ id: requestingAuthorityId });
    if (!authority) throw new NotFoundException(`Autoridade com ID ${requestingAuthorityId} não encontrada.`);
    const city = await this.cityRepository.findOneBy({ id: cityId });
    if (!city) throw new NotFoundException(`Cidade com ID ${cityId} não encontrada.`);
    const year = new Date().getFullYear();
    const countThisYear = await this.pdtRepository.count({ where: { caseNumber: Like(`%-${year}`) } });
    const sequential = countThisYear + 1;
    const caseNumber = `${sequential}-${year}`;
    const newPdt = this.pdtRepository.create({ ...pdtData, caseNumber, procedure, occurrenceClassification: classification, responsibleExpert: expert, requestingUnit: unit, requestingAuthority: authority, city, createdBy: creatingUser });
    return this.pdtRepository.save(newPdt);
  }

  async sendToLab(id: string, sendToLabDto: SendToLabDto): Promise<PreliminaryDrugTest> {
    // ... (seu método sendToLab está correto, não precisa mudar)
    const pdt = await this.pdtRepository.findOneBy({ id });
    if (!pdt) throw new NotFoundException(`Exame preliminar com o ID "${id}" não encontrado.`);
    if (pdt.caseStatus !== CaseStatus.PRELIMINARY_DONE) throw new BadRequestException(`Este caso não pode ser enviado para o laboratório, pois seu status atual é "${pdt.caseStatus}".`);
    const forensicService = await this.forensicServiceRepository.findOneBy({ id: sendToLabDto.forensicServiceId });
    if (!forensicService) throw new NotFoundException(`Serviço pericial com o ID "${sendToLabDto.forensicServiceId}" não encontrado.`);
    pdt.definitiveService = forensicService;
    pdt.caseStatus = CaseStatus.IN_LAB_ANALYSIS;
    return this.pdtRepository.save(pdt);
  }

  async findAll(): Promise<PreliminaryDrugTest[]> {
    return this.pdtRepository.find();
  }

  async findOne(id: string): Promise<PreliminaryDrugTest> {
    const pdt = await this.pdtRepository.findOneBy({ id });
    if (!pdt) {
      throw new NotFoundException(`Exame preliminar com o ID "${id}" não encontrado.`);
    }
    return pdt;
  }

  async update(id: string, updateDto: UpdatePreliminaryDrugTestDto, currentUser: User): Promise<PreliminaryDrugTest> {
    // ... (seu método update está correto, não precisa mudar)
    const pdt = await this.pdtRepository.findOne({ where: { id }, relations: ['createdBy'] });
    if (!pdt) throw new NotFoundException(`Exame preliminar com o ID "${id}" não encontrado.`);
    const isOwner = pdt.createdBy.id === currentUser.id;
    const isAdmin = currentUser.role === UserRole.SUPER_ADMIN;
    if (pdt.isLocked && !isAdmin) throw new ForbiddenException('Este registro está travado e não pode mais ser editado.');
    if (!isOwner && !isAdmin) throw new ForbiddenException('Você não tem permissão para editar este registro.');
    const updatedPdt = this.pdtRepository.merge(pdt, updateDto);
    return this.pdtRepository.save(updatedPdt);
  }

  // --- MÉTODO UPLOADREPORT CORRIGIDO ---
  async uploadReport(
    id: string,
    file: any,
    currentUser: User,
  ): Promise<PreliminaryDrugTest> {
    // 1. Busca o caso e valida as permissões de edição
    const pdt = await this.update(id, {}, currentUser);

    // 2. Chama o DocumentsService com os parâmetros corretos
    await this.documentsService.uploadFile(
      file,
      pdt.id,
      'PreliminaryDrugTest',
      DocumentType.PRELIMINARY_REPORT,
      currentUser,
    );

    // 3. Trava o registro
    pdt.isLocked = true;
    pdt.lockedAt = new Date();
    pdt.lockedBy = currentUser;

    // 4. Salva o registro atualizado
    return this.pdtRepository.save(pdt);
  }
  // --- FIM DO MÉTODO ---

  async remove(id: string): Promise<void> {
    const pdt = await this.findOne(id);
    await this.pdtRepository.softDelete(pdt.id);
  }
}