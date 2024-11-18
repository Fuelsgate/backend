import { QueryDto } from "src/shared/types";

export type ProductStatus = 'active' | 'inactive';

export interface ProductDto {
  name: string
  value: string
  color: string
  status: ProductStatus
}

export interface ProductQueryDto extends QueryDto { }