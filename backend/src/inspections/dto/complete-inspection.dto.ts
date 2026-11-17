import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { InspectionResult } from '../inspection.entity';

export class CompleteInspectionDto {
  @IsInt()
  @IsPositive()
  locationId: number;

  @IsISO8601({ strict: true })
  startedAt: string;

  @IsInt()
  @Min(1)
  durationMinutes: number;

  @IsEnum(InspectionResult)
  result: InspectionResult;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comments?: string;
}
