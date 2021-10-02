import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dtos/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.find({ active: true });
    if (categories.length == 0) {
      throw new NotFoundException(`No se productos registrados`);
    }
    return categories;
  }

  async getById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new NotFoundException(`Categoria con id ${id} no encontrada`);
    }

    return category;
  }

  async create(category: CreateCategoryDto): Promise<Category> {
    const categoryDB = await this.categoryRepository.findOne({
      name: category.name,
    });

    if (categoryDB) {
      throw new BadRequestException(
        `Ya existe una categoria con nombre ${category.name}`,
      );
    }

    const newCategory = this.categoryRepository.create(category);
    await this.categoryRepository.save(newCategory);
    return newCategory;
  }

  async update(id: number, changes: UpdateCategoryDto): Promise<Category> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { active, ...category } = changes; // Removemos las propiedades que no queremos actualizar
    const categoryDB = await this.categoryRepository.findOne(id);

    if (!categoryDB) {
      throw new NotFoundException(`Categoria con id ${id} no encontrada`);
    }

    this.categoryRepository.merge(categoryDB, category);
    return await this.categoryRepository.save(categoryDB);
  }

  async delete(id: number) {
    const categoryDB = await this.categoryRepository.findOne(id);

    if (!categoryDB) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }

    categoryDB.active = false;
    return await this.categoryRepository.save(categoryDB);
  }

  async activateCategory(id: number) {
    const categoryDB = await this.categoryRepository.findOne(id);

    if (!categoryDB) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }

    if (categoryDB.active == true) {
      return new BadRequestException(`Categoría ya se encuentra activa`);
    }

    categoryDB.active = true;
    return await this.categoryRepository.save(categoryDB);
  }
}
