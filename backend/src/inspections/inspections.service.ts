import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../locations/location.entity';
import { User, UserRole } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AssignInspectionDto } from './dto/assign-inspection.dto';
import { CompleteInspectionDto } from './dto/complete-inspection.dto';
import { Inspection, InspectionStatus } from './inspection.entity';

export type AuthUser = Pick<User, 'id' | 'email' | 'name' | 'role'>;

@Injectable()
export class InspectionsService {
  constructor(
    @InjectRepository(Inspection)
    private inspections: Repository<Inspection>,
    private users: UsersService,
  ) {}

  // List inspections based on role
  findAll(user: AuthUser) {
    if (user.role === UserRole.Manager) {
      return this.inspections.find({ order: { id: 'DESC' } });
    }
    return this.inspections.find({
      where: { assignedInspectorId: user.id },
      order: { id: 'DESC' },
    });
  }

  // Create Inspection (Manager)
  create() {
    return this.inspections.save(
      this.inspections.create({ status: InspectionStatus.YetToStart }),
    );
  }

  // Assign Inspection (Manager)
  async assign(id: number, dto: AssignInspectionDto) {
    const inspection = await this.inspections.findOneBy({ id });
    if (!inspection) {
      throw new NotFoundException('Inspection not found');
    }
    if (inspection.status !== InspectionStatus.YetToStart) {
      throw new BadRequestException('Only Yet to Start inspections can be assigned');
    }

    const inspector = await this.users.findById(dto.inspectorId);
    if (!inspector || inspector.role !== UserRole.Inspector) {
      throw new BadRequestException('Invalid inspector');
    }

    inspection.assignedInspectorId = inspector.id;
    return this.inspections.save(inspection);
  }

  // Complete Inspection (Inspector)
  async complete(id: number, user: AuthUser, dto: CompleteInspectionDto) {
    const inspection = await this.inspections.findOneBy({
      id,
      assignedInspectorId: user.id,
    });
    if (!inspection) {
      throw new NotFoundException('Inspection not found');
    }
    if (inspection.status !== InspectionStatus.YetToStart) {
      throw new BadRequestException('Inspection is already completed');
    }

    const location = await this.inspections.manager.findOneBy(Location, {
      id: dto.locationId,
    });
    if (!location) {
      throw new BadRequestException('Invalid location');
    }

    inspection.locationId = location.id;
    inspection.startedAt = new Date(dto.startedAt);
    inspection.durationMinutes = dto.durationMinutes;
    inspection.result = dto.result;
    inspection.comments = dto.comments ?? null;
    inspection.status = InspectionStatus.Completed;
    return this.inspections.save(inspection);
  }
}