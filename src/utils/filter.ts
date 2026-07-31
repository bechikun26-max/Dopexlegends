import type { Legend, Weapon, LegendClass, WeaponCategory, AmmoType } from '../types';

export function filterByClass(legends: Legend[], className: LegendClass): Legend[] {
  return legends.filter(legend => legend.class === className);
}

export function filterByCategory(weapons: Weapon[], category: WeaponCategory): Weapon[] {
  return weapons.filter(weapon => weapon.category === category);
}

export function filterByAmmoType(weapons: Weapon[], ammoType: AmmoType): Weapon[] {
  return weapons.filter(weapon => weapon.ammoTypes.includes(ammoType));
}
