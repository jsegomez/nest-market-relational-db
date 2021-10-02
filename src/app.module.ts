import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

// Environment
import { ConfigModule } from '@nestjs/config';
import { environments } from './environments';
import { DatabaseModule } from './database/database.module';
import config from './config';

@Module({
  imports: [
    ProductsModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
