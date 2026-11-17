import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Location } from '../locations/location.entity';

export enum InspectionStatus {
  YetToStart = 'Yet to Start',
  Completed = 'Completed',
}

export enum InspectionResult {
  Pass = 'Pass',
  Fail = 'Fail',
}

@Entity('inspections')
export class Inspection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: InspectionStatus,
    default: InspectionStatus.YetToStart,
  })
  status: InspectionStatus;

  @Column({ type: 'int', nullable: true })
  assignedInspectorId: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignedInspectorId' })
  assignedInspector: User | null;

  @Column({ type: 'int', nullable: true })
  locationId: number | null;

  @ManyToOne(() => Location, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'locationId' })
  location: Location | null;

  @Column({ type: 'datetime', nullable: true })
  startedAt: Date | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  durationMinutes: number | null;

  @Column({ type: 'enum', enum: InspectionResult, nullable: true })
  result: InspectionResult | null;

  @Column({ type: 'text', nullable: true })
  comments: string | null;
}