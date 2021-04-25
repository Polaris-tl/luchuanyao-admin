export function getStore(name: string) {
  if (!name) {
    return false;
  }
  return window.sessionStorage.getItem(name);
};

/**
 * 判断用户是否有此菜单权限
 * @param menus 服务器返回的权限列表
 * @param code 本地的菜单code
 */
export function containCode(menus: any[], code: string): boolean {
  for (let i = 0; i < menus.length; i++) {
    const element = menus[i];
    if (element.code === code) {
      return true;
    } else if (element.children && containCode(element.children, code)) {
      return true;
    }
  }
  return false;
}


/**
 * 
 * @param pageCode 判断用户页面权限
 * @returns boolean
 */
export function hasPagePermmision(pageCode: string): boolean {
  const permissionStore = getStore('authMenuList');
  if (!permissionStore) return false;
  const menuTree = JSON.parse(permissionStore) as any[];
  return containCode(menuTree, pageCode);
}

/**
 * @param pageCode 判断用户页面按钮权限
 * @returns boolean
 */
export function hasButtonPermission(pageCode: string, buttonType: string) {
  const authPermissionList = JSON.parse(getStore('authPermissionList') || '[]');
  const permissionList = authPermissionList[pageCode] as string[];
  return permissionList.indexOf(buttonType) !== -1;;
}