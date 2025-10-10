import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';

@Controller('specialties')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Post()
  create(@Body() createSpecialtyDto: CreateSpecialtyDto) {
    return this.specialtyService.create(createSpecialtyDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.specialtyService.findAll(parseInt(page), parseInt(limit));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.specialtyService.findOne(id);
  }
}