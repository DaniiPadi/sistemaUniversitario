import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CycleService } from './cycle.service';
import { CreateCycleDto } from './dto/create-cycle.dto';

@Controller('cycles')
export class CycleController {
  constructor(private readonly cycleService: CycleService) {}

  @Post()
  create(@Body() createCycleDto: CreateCycleDto) {
    return this.cycleService.create(createCycleDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.cycleService.findAll(parseInt(page), parseInt(limit));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cycleService.findOne(id);
  }
}