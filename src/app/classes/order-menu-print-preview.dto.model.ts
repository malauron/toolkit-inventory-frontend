import { OrderMenuDto } from './order-menu-dto.model';

export class OrderMenuPrintPreviewDto {
  constructor(
    public orderId?: number,
    public dateCreated?: string,
    public customerName?: string,
    public warehouseName?: string,
    public contactNo?: string,
    public address?: string,
    public orderMenu?: OrderMenuDto
  ) {}
}
