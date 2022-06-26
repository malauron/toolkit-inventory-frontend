import { Menu } from './menu.model';

export class CartMenu {
  constructor(
    private cartMenuId?: number,
    private menu?: Menu,
    private orderQty?: number,
    private price?: number,
    private lineTotal?: number
  ) {}
}
