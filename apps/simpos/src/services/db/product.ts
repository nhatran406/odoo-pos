import { db } from './db';
import { posCategoryRepository } from './pos-category';
import { ProductVariant, productVariantRepository } from './product-variant';

export interface Product {
  id: number;
  name: string;
  sequence: number;
  barcode: string;
  defaultCode: string;
  description: string;
  lstPrice: number;
  productVariantIds: number[];
  productVariantId: [number, string];
  posCategoryId: number;
  productVariants: ProductVariant[];
}

export const productRepository = {
  db: db.table<Product>('product.template'),

  async all(): Promise<Product[]> {
    const products = await this.db.toArray();
    return this.enrichProductVariants(products);
  },
  async findProducts(categoryId?: number, keyword = ''): Promise<Product[]> {
    let products = [];
    if (categoryId) {
      const posCategory = await posCategoryRepository.findById(categoryId);
      const categoryIds = posCategory?.childId || [];
      categoryIds.push(categoryId);
      products = await this.db
        .where('posCategoryId')
        .anyOf(categoryIds)
        .toArray();
    } else {
      products = await this.db.toArray();
    }

    return this.enrichProductVariants(products);
  },
  async enrichProductVariants(products: Product[]): Promise<Product[]> {
    return Promise.all(
      products.map((product) =>
        productVariantRepository.db
          .where('id')
          .anyOf(product.productVariantIds)
          .toArray()
          .then((variants) => ({
            ...product,
            productVariants: variants,
          })),
      ),
    );
  },
};
