
import Menu from './../models/Menu';

export const HOME = "home";
export const CATALOG = "catalog";
export const ABOUT = "about";
export const ACCOUNT = "account";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const DASHBOARD = "dashboard";
export const TRANSACTION_SELLING = "selling";
export const MENU_TRANSACTION = "purchasing";
export const SUPPLIERLIST = "supplierlist";
export const MENU_MASTER_DATA = "management";
export const CHATROOM = "chatroom";
export const CART = "cart";

export const getMenus = () => {
    let menuSet: Menu[] = [];
    for (let i = 0; i < menus.length; i++) {
        const element: Menu = menus[i];
        menuSet.push(element);
    }
    return menuSet;
}
export const extractMenuPath = (pathName: string) => {
    const pathRaw = pathName.split('/');
    console.debug("pathName: ", pathName);
    let firstPath = pathRaw[0];
    if (firstPath.trim() == "") {
        firstPath = pathRaw[1];
    }
    return firstPath;
}
export const getMenuByMenuPath = (pathName: string): Menu | null => {
    try {
        for (let i = 0; i < menus.length; i++) {
            const menu: Menu = menus[i];
            if (menu.url == "/" + pathName) {
                return menu;
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

export const menus: Menu[] = [
    {
        code: HOME,
        name: "Home",
        url: "/home",
        menuClass: "fa fa-home",
        active: false,
        authenticated: false,
        showSidebar: false
    },
    {
        code: CATALOG,
        name: "Catalog",
        url: "/catalog",
        menuClass: "fa fa-th-large",
        active: false,
        authenticated: false,
        showSidebar: true,
        subMenus: [{
            code: 'catalog_product',
            name: 'Product',
            url: 'product',
            menuClass: 'fas fa-cubes'
        },
        {
            code: 'catalog_supplier',
            name: 'Supplier',
            url: 'supplier',
        }]
    },
    {
        code: CART,
        name: "Shopping Cart",
        url: "/cart",
        menuClass: "fa fa-shopping-cart",
        active: false,
        authenticated: false,
        showSidebar: true,
        subMenus: [
            {
                code: 'cart_list',
                name: 'Shopping Cart List',
                menuClass: 'fas fa-shopping-bag',
                url: 'cartlist',
            },
        ]
    },
    {
        code: DASHBOARD,
        name: "Dashboard",
        url: "/dashboard",
        menuClass: "fas fa-tachometer-alt",
        active: false,
        authenticated: true,
        showSidebar: true,
        subMenus: [
            {
                code: 'dashboard_stat',
                name: 'Statistic',
                url: 'statistic',
                menuClass: 'fas fa-chart-bar'

            },
            {
                code: 'dashboard_productsales',
                name: 'Product Sales',
                url: 'productsales',
                menuClass: 'fas fa-chart-line'
            }
        ]
    },
    {
        code: MENU_TRANSACTION,
        name: "Transaction",
        url: "/transaction",
        menuClass: "fas fa-suitcase",
        active: false,
        authenticated: true,
        showSidebar: true,
        subMenus: [
            {
                code: 'trx_selling',
                name: 'Selling',
                menuClass: 'fas fa-cash-register',
                url: 'selling',
            },
            {
                code: 'trx_purchasing',
                name: 'Purchasing',
                menuClass: 'fas fa-shopping-basket',
                url: 'purchasing',
            },
            {
                code: 'trx_detail',
                name: 'Transaction Detail',
                menuClass: 'fas fa-clipboard-list',
                url: 'detail',
            }
        ]
    },
    {
        code: MENU_MASTER_DATA,
        name: "Master Data",
        url: "/management",
        menuClass: "fa fa-database",
        active: false,
        authenticated: true,
        showSidebar: true
    },
];
