import { Module } from '@nestjs/common';

// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers
import { ProductsController } from './controllers/products/products.controller';
import { CategoriesController } from './controllers/categories/categories.controller';

// Entities
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';

// Services
import { ProductsService } from './services/products/products.service';
import { CategoryService } from './services/category/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  providers: [ProductsService, CategoryService],
  controllers: [ProductsController, CategoriesController],
})
export class ProductsModule {}
