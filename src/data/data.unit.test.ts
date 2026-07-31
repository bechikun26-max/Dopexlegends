import { describe, it, expect } from 'vitest';
import { LEGENDS } from './legends';
import { WEAPONS } from './weapons';
import { RULES } from './rules';

describe('Static Data Validation', () => {
  it('has 28 legends total', () => {
    expect(LEGENDS).toHaveLength(28);
  });

  it('has correct class distribution', () => {
    expect(LEGENDS.filter(l => l.class === 'Assault')).toHaveLength(5);
    expect(LEGENDS.filter(l => l.class === 'Skirmisher')).toHaveLength(7);
    expect(LEGENDS.filter(l => l.class === 'Recon')).toHaveLength(6);
    expect(LEGENDS.filter(l => l.class === 'Support')).toHaveLength(6);
    expect(LEGENDS.filter(l => l.class === 'Controller')).toHaveLength(4);
  });

  it('Ballistic has hasThirdWeaponSlot: true', () => {
    const ballistic = LEGENDS.find(l => l.id === 'ballistic');
    expect(ballistic).toBeDefined();
    expect(ballistic!.hasThirdWeaponSlot).toBe(true);
  });

  it('all other legends have hasThirdWeaponSlot: false', () => {
    const others = LEGENDS.filter(l => l.id !== 'ballistic');
    expect(others.every(l => l.hasThirdWeaponSlot === false)).toBe(true);
  });

  it('all legends have image paths', () => {
    for (const legend of LEGENDS) {
      expect(legend.imagePath).toMatch(/^\/images\/legends\/[\w-]+\.png$/);
    }
  });

  it('all legend IDs are unique', () => {
    const ids = LEGENDS.map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has 29 weapons total', () => {
    expect(WEAPONS).toHaveLength(29);
  });

  it('has correct weapon category distribution', () => {
    expect(WEAPONS.filter(w => w.category === 'Shotgun')).toHaveLength(4);
    expect(WEAPONS.filter(w => w.category === 'SMG')).toHaveLength(5);
    expect(WEAPONS.filter(w => w.category === 'Pistol')).toHaveLength(3);
    expect(WEAPONS.filter(w => w.category === 'AR')).toHaveLength(5);
    expect(WEAPONS.filter(w => w.category === 'LMG')).toHaveLength(4);
    expect(WEAPONS.filter(w => w.category === 'Marksman')).toHaveLength(4);
    expect(WEAPONS.filter(w => w.category === 'Sniper')).toHaveLength(4);
  });

  it('C.A.R. has dual ammo types', () => {
    const car = WEAPONS.find(w => w.id === 'car');
    expect(car).toBeDefined();
    expect(car!.ammoTypes).toEqual(['Light', 'Heavy']);
  });

  it('Kraber is a care package weapon', () => {
    const kraber = WEAPONS.find(w => w.id === 'kraber');
    expect(kraber).toBeDefined();
    expect(kraber!.isCarePackage).toBe(true);
  });

  it('only Kraber is a care package weapon', () => {
    const carePackageWeapons = WEAPONS.filter(w => w.isCarePackage);
    expect(carePackageWeapons).toHaveLength(1);
    expect(carePackageWeapons[0].id).toBe('kraber');
  });

  it('all weapon IDs are unique', () => {
    const ids = WEAPONS.map(w => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has 18 rules total', () => {
    expect(RULES).toHaveLength(18);
  });

  it('has correct rule category distribution', () => {
    expect(RULES.filter(r => r.category === 'LegendClass')).toHaveLength(5);
    expect(RULES.filter(r => r.category === 'WeaponCategory')).toHaveLength(7);
    expect(RULES.filter(r => r.category === 'AmmoType')).toHaveLength(6);
  });

  it('all rule IDs are unique', () => {
    const ids = RULES.map(r => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
