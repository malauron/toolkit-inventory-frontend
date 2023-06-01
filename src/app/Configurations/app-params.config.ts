import { DOCUMENT, Location, LocationStrategy } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppParamsConfig {
  url: any;
  urlItems: any;
  urlItemSearch: any;
  urlItemUoms: any;
  urlItemUomSearch: any;
  urlItemCosts: any;
  urlItemCostSearchByWarehouseIdAndItemName: any;
  urlCustomers: any;
  urlCustomerSearch: any;
  urlCustomerFindByNameOrId: any;
  urlUoms: any;
  urlMenus: any;
  urlMenuSearch: any;
  urlMenuIngredients: any;
  urlMenuIngredientSearch: any;
  urlCartMenus: any;
  urlCartMenuSearch: any;
  urlOrders: any;
  urlOrdersSearch: any;
  urlVendors: any;
  urlVendorSearch: any;
  urlPurchases: any;
  urlPurchasesSearch: any;
  urlWarehouse: any;
  urlWarehouseSearch: any;
  urlWarehouseSearchById: any;
  urlButcheryProductions: any;
  urlButcheryProductionsSearch: any;
  urlButcheryReleasings: any;
  urlButcheryReleasingsSearch: any;
  urlButcheryReceivings: any;
  urlButcheryReceivingsSearch: any;
  urlButcheryReceivingItems: any;
  urlButcheryReceivingItemsSearchByWarehouseId: any;
  urlInventoryItems: any;
  urlInventoryItemsSearch: any;
  urlInventoryHistories: any;
  urlPosSales: any;
  urlPosSalesSearch: any;
  urlPosItemPrice: any;
  urlPosItemPriceSearch: any;

  urlV1: any;
  urlV1Items: any;
  urlV1ItemsFindByItemCode: any;
  urlV1ItemCosts: any;
  urlV1ItemUoms: any;
  urlV1ItemBoms: any;
  urlV1ItemGenerics: any;
  urlV1Menus: any;
  urlV1MenuIngredients: any;
  urlV1CartMenus: any;
  urlV1CartSingleMenu: any;
  urlV1CartMenuIngredients: any;
  urlV1CartMenuCount: any;
  urlV1Orders: any;
  urlV1OrderMenus: any;
  urlV1OrderSetStatus: any;
  urlV1OrderMenuIngredients: any;
  urlV1OrderMenuIngredientSummary: any;
  urlV1Purchases: any;
  urlV1PurchaseSetVendor: any;
  urlV1PurchaseSetStatus: any;
  urlV1PurchaseItems: any;
  urlV1Customers: any;
  urlV1CustomerGroups: any;
  urlV1ButcheryProductions: any;
  urlV1ButcheryProductionsSetStatus: any;
  urlV1ButcheryProductionItems: any;
  urlV1ButcheryProductionSources: any;
  urlV1ButcheryReleasings: any;
  urlV1ButcheryReleasingsSearch: any;
  urlV1ButcheryReleasingsSetStatus: any;
  urlV1ButcheryReleasingItems: any;
  urlV1ButcheryReceivings: any;
  urlV1ButcheryReceivingsSearch: any;
  urlV1ButcheryReceivingsSetStatus: any;
  urlV1ButcheryReceivingItems: any;
  urlV1InventoryItems: any;
  urlV1InventoryItemsSetEndingQty: any;
  urlV1InventoryItemsSetPrice: any;
  urlV1InventoryHistories: any;
  urlV1InventoryHistoryItems: any;
  urlV1PosSales: any;
  urlV1PosSalesSetStatus: any;
  urlV1PosSaleItems: any;
  urlV1PosItemPrices: any;

  waitTime: number;
  pageSize: number;

  editItem: true;
  editMenu: true;

  constructor() {

    // this.url = 'http://localhost:8443/api';
    this.url = `${location.protocol}//${location.hostname}:8443/api`;

    this.urlItems = this.url + '/items';
    this.urlItemSearch = `${this.urlItems}/search/findByItemNameContainingOrderByItemName`;
    this.urlItemUoms = `${this.url}/itemUoms`;
    this.urlItemUomSearch = `${this.urlItemUoms}/search/findByItemId`;
    this.urlItemCosts = `${this.url}/itemCosts`;
    this.urlItemCostSearchByWarehouseIdAndItemName = `${this.urlItemCosts}/search/findByWarehouseIdAndItemName`;
    this.urlCustomers = `${this.url}/customers`;
    this.urlCustomerSearch = `${this.urlCustomers}/search/findByCustomerNameContainingOrderByCustomerName`;
    this.urlCustomerFindByNameOrId = `${this.urlCustomers}/search/findByNameOrId`;
    this.urlUoms = this.url + '/uoms';
    this.urlMenus = `${this.url}/menus`;
    this.urlMenuSearch = `${this.urlMenus}/search/findByMenuNameContainingOrderByMenuName`;
    this.urlMenuIngredients = `${this.url}/menuIngredients`;
    this.urlMenuIngredientSearch = `${this.urlMenuIngredients}/search/findByMenuId?menuId=`;
    this.urlCartMenus = `${this.url}/cartMenus`;
    this.urlCartMenuSearch = `${this.urlCartMenus}/search/findAllCartMenus`;
    this.urlOrders = `${this.url}/orders`;
    this.urlOrdersSearch = `${this.urlOrders}/search/findUndeliveredOrders`;
    this.urlVendors = `${this.url}/vendors`;
    this.urlVendorSearch = `${this.urlVendors}/search/findByVendorNameContainingOrderByVendorName`;
    this.urlPurchases = `${this.url}/purchases`;
    this.urlPurchasesSearch = `${this.urlPurchases}/search/findUnpostedPurchases`;
    this.urlWarehouse = `${this.url}/warehouses`;
    this.urlWarehouseSearch = `${this.urlWarehouse}/search/findByWarehouseNameContainingOrderByWarehouseName`;
    this.urlWarehouseSearchById = `${this.urlWarehouse}/search/findByWarehouseId?id=`;
    this.urlButcheryProductions = `${this.url}/butcheryProductions`;
    this.urlButcheryProductionsSearch = `${this.urlButcheryProductions}/search/findByCustomParam`;
    this.urlButcheryReleasings = `${this.url}/butcheryReleasings`;
    this.urlButcheryReleasingsSearch = `${this.urlButcheryReleasings}/search/findByCustomParam`;
    this.urlButcheryReceivings = `${this.url}/butcheryReceivings`;
    this.urlButcheryReceivingsSearch = `${this.urlButcheryReceivings}/search/findByCustomParam`;
    this.urlButcheryReceivingItems = `${this.url}/butcheryReceivingItems`;
    this.urlButcheryReceivingItemsSearchByWarehouseId =
      `${this.urlButcheryReceivingItems}/search/findByWarehouseAndIsAvailablePageable?` +
      `projection=butcheryReceivingItemView&warehouseId=`;
    this.urlInventoryItems = `${this.url}/inventoryItems`;
    this.urlInventoryItemsSearch = `${this.urlInventoryItems}/search/findByCustomParam?`;
    this.urlInventoryHistories = `${this.url}/inventoryHistories`;
    this.urlPosSales = `${this.url}/posSales`;
    this.urlPosSalesSearch = `${this.urlPosSales}/search/findByCustomParam`;
    this.urlPosItemPrice = `${this.url}/posItemPrices`;
    this.urlPosItemPriceSearch = `${this.urlPosItemPrice}/search/findByWarehouseIdAndItemId`;

    this.urlV1 = `${this.url}/v1`;

    this.urlV1Items = this.urlV1 + '/items';
    this.urlV1ItemsFindByItemCode = `${this.urlV1Items}?itemCode=`;
    this.urlV1ItemCosts = `${this.urlV1}/itemCosts`;
    this.urlV1ItemUoms = this.urlV1 + '/itemUoms';
    this.urlV1ItemBoms = `${this.urlV1}/itemBoms`;
    this.urlV1ItemGenerics = `${this.urlV1}/itemGenerics`;
    this.urlV1Menus = this.urlV1 + '/menus';
    this.urlV1MenuIngredients = `${this.urlV1}/menuIngredients`;
    this.urlV1CartMenus = `${this.urlV1}/cartMenus`;
    this.urlV1CartSingleMenu = `${this.urlV1}/cartSingleMenu`;
    this.urlV1CartMenuIngredients = `${this.urlV1}/cartMenuIngredients`;
    this.urlV1CartMenuCount = `${this.urlV1CartMenus}/count`;
    this.urlV1Orders = `${this.urlV1}/orders`;
    this.urlV1OrderMenus = `${this.urlV1Orders}/orderMenus`;
    this.urlV1OrderMenuIngredients = `${this.urlV1OrderMenus}/orderMenuIngredients`;
    this.urlV1OrderMenuIngredientSummary = `${this.urlV1Orders}/orderMenuIngredientSummary`;
    this.urlV1OrderSetStatus = `${this.urlV1Orders}/orderStatus`;
    this.urlV1Purchases = `${this.urlV1}/purchases`;
    this.urlV1PurchaseSetVendor = `${this.urlV1Purchases}/vendor`;
    this.urlV1PurchaseSetStatus = `${this.urlV1Purchases}/purchaseStatus`;
    this.urlV1PurchaseItems = `${this.urlV1}/purchaseItems`;
    this.urlV1Customers = `${this.urlV1}/customers`;
    this.urlV1CustomerGroups = `${this.urlV1}/customerGroups`;
    this.urlV1ButcheryProductions = `${this.urlV1}/butcheryProductions`;
    this.urlV1ButcheryProductionsSetStatus = `${this.urlV1ButcheryProductions}/productionStatus`;
    this.urlV1ButcheryProductionItems = `${this.urlV1}/butcheryProductionItems`;
    this.urlV1ButcheryProductionSources = `${this.urlV1}/butcheryProductionSources`;
    this.urlV1ButcheryReleasings = `${this.urlV1}/butcheryReleasings`;
    this.urlV1ButcheryReleasingsSetStatus = `${this.urlV1ButcheryReleasings}/releasingStatus`;
    this.urlV1ButcheryReleasingItems = `${this.urlV1}/butcheryReleasingItems`;
    this.urlV1ButcheryReceivings = `${this.urlV1}/butcheryReceivings`;
    this.urlV1ButcheryReceivingsSetStatus = `${this.urlV1ButcheryReceivings}/receivingStatus`;
    this.urlV1ButcheryReceivingItems = `${this.urlV1}/butcheryReceivingItems`;
    this.urlV1InventoryItems = `${this.urlV1}/inventoryItems`;
    this.urlV1InventoryItemsSetEndingQty = `${this.urlV1InventoryItems}/endingQty`;
    this.urlV1InventoryItemsSetPrice = `${this.urlV1InventoryItems}/price`;
    this.urlV1InventoryHistoryItems = `${this.urlV1}/inventoryHistoryItems`;
    this.urlV1PosSales = `${this.urlV1}/posSales`;
    this.urlV1PosSaleItems = `${this.urlV1}/posSaleItems`;
    this.urlV1PosSalesSetStatus = `${this.urlV1PosSales}/saleStatus`;
    this.urlV1PosItemPrices = `${this.urlV1}/posItemPrices`;

    this.waitTime = 500;
    this.pageSize = 20;
  }
}
