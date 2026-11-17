import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/user.entity';
import { AssignInspectionDto } from './dto/assign-inspection.dto';
import { CompleteInspectionDto } from './dto/complete-inspection.dto';
import { AuthUser, InspectionsService } from './inspections.service';

@Controller('inspections')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InspectionsController {
  constructor(private inspections: InspectionsService) {}

  @Get()
  @Roles(UserRole.Manager, UserRole.Inspector)
  list(@Req() req: { user: AuthUser }) {
    return this.inspections.findAll(req.user);
  }

  @Post()
  @Roles(UserRole.Manager)
  create() {
    return this.inspections.create();
  }

  @Patch(':id/assign')
  @Roles(UserRole.Manager)
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignInspectionDto,
  ) {
    return this.inspections.assign(id, dto);
  }

  @Patch(':id/complete')
  @Roles(UserRole.Inspector)
  complete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: AuthUser },
    @Body() dto: CompleteInspectionDto,
  ) {
    return this.inspections.complete(id, req.user, dto);
  }
}