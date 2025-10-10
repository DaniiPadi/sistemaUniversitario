import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: ['query', 'error', 'warn'],
    });
  }

  async onModuleInit() {
    try {
      console.log('🔄 Conectando a Neon Database...');
      
      // Aumentar timeout a 60 segundos
      await this.$connect();
      
      console.log('✅ Conectado exitosamente a Neon Database');
    } catch (error) {
      console.error('❌ Error al conectar a la base de datos:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}