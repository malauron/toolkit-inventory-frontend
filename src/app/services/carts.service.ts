import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartMenuDto } from '../classes/cart-menu-dto.model';
import { ConfigParam } from '../ConfigParam';

export class CartsService {

  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: ConfigParam
  ) {}

  postCartMenu(cartMenuDto: CartMenuDto){
    this.apiUrl = `${this.config.urlV1CartMenus}`;
    return this.http.post(this.apiUrl, cartMenuDto);
  }

}
