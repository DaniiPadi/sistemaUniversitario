import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CareerService } from './career.service';
import { CreateCareerDto } from './dto/create-career.dto';

@Controller('careers')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @Post()
  create(@Body() createCareerDto: CreateCareerDto) {
    return this.careerService.create(createCareerDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.careerService.findAll(parseInt(page), parseInt(limit));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.careerService.findOne(id);
  }
}