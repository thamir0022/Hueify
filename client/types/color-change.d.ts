// types/color-change.d.ts
declare module "color-change" {
  export class ColorChange {
    constructor(selector: string);
    setColor(color: string): Promise<void>;
  }
}
