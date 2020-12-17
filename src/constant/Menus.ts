
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
    let menuSet:Menu[] = [];
    for (let i = 0; i < menus.length; i++) {
        const element:Menu = menus[i];
        menuSet.push(element);
    }
    return menuSet;
}

export const getMenuByPathName = (pathName:string) => {
    try {
        const pathRaw = pathName.split('/');
        let firstPath = pathRaw[0];
        if (firstPath.trim() == "") {
            firstPath = pathRaw[1];
        }
        for (let i = 0; i < menus.length; i++) {
            const menu:Menu = menus[i];
            if (menu.url == "/"+firstPath) {
                return menu;
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

export const menus:Menu[] = [
    {
        code: HOME,
        name: "Home",
        url: "/home",
        menuClass: "fa fa-home",
        active: false,
        authenticated: false,
        showSidebar:false
    },
    {
        code: CATALOG,
        name: "Catalog",
        url: "/catalog",
        menuClass: "fa fa-store-alt",
        active: false,
        authenticated: false,
        showSidebar:true
    },
    {
        code: CART,
        name: "My Cart",
        url: "/cart",
        menuClass: "fa fa-shopping-cart",
        active: false,
        authenticated: false,
        showSidebar:true
    },
    {
        code: DASHBOARD,
        name: "Dashboard",
        url: "/dashboard",
        menuClass: "fas fa-tachometer-alt",
        active: false,
        authenticated: true,
        showSidebar:true
    },
    {
        code: MENU_TRANSACTION,
        name: "Transaction",
        url: "/transaction",
        menuClass: "fas fa-truck-loading",
        active: false,
        authenticated: true,
        showSidebar: true
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
