import { Cloth } from "../src/HabboValidator";

test('Cloth.compareCloth', () => {
    let ref = new Cloth("ch-01-01");
    expect(ref.compareCloth(new Cloth('ch-01-01'))).toBe(0);
    expect(ref.compareCloth(new Cloth('xx-01-01'))).toBe(1);
    expect(ref.compareCloth(new Cloth('ch-00-01'))).toBe(2);
    expect(ref.compareCloth(new Cloth('xx-00-01'))).toBe(3);
    expect(ref.compareCloth(new Cloth('ch-01-00'))).toBe(4);
    expect(ref.compareCloth(new Cloth('xx-01-00'))).toBe(5);
    expect(ref.compareCloth(new Cloth('ch-00-00'))).toBe(6);
    expect(ref.compareCloth(new Cloth('xx-00-00'))).toBe(7);
});