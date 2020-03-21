export enum RoleType {
  user = 'user',
  manager = 'manager',
  admin = 'admin',
}

// tslint:disable-next-line: no-namespace
export namespace RoleType {
  export function all() {
    return Object.keys(RoleType).filter(x => typeof RoleType[x] !== 'function') as RoleType[];
  }
}
