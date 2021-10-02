import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../../dtos/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getAll(): Promise<Product[]> {
    const products = await this.productRepository.find();
    if (products.length == 0) {
      throw new NotFoundException(`No se productos registrados`);
    }
    return products;
  }

  async getById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    return product;
  }

  async create(product: CreateProductDto): Promise<Product> {
    const productDB = await this.productRepository.findOne({
      name: product.name,
    });

    if (productDB) {
      throw new BadRequestException(
        `Ya existe producto con nombre ${product.name}`,
      );
    }

    const newProduct = this.productRepository.create(product);
    await this.productRepository.save(newProduct);
    return newProduct;
  }

  async update(id: number, changes: UpdateProductDto): Promise<Product> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { active, ...product } = changes; // Removemos las propiedades que no queremos actualizar
    const productDB = await this.productRepository.findOne(id);

    if (!productDB) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    this.productRepository.merge(productDB, product);
    return await this.productRepository.save(productDB);
  }

  async delete(id: number) {
    const productDB = await this.productRepository.findOne(id);

    if (!productDB) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    productDB.active = false;
    return await this.productRepository.save(productDB);
  }

  async activateProduct(id: number) {
    const productDB = await this.productRepository.findOne(id);

    if (!productDB) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    if (productDB.active == true) {
      return new BadRequestException(`Producto ya se encuentra activo`);
    }

    productDB.active = true;
    return await this.productRepository.save(productDB);
  }
}
