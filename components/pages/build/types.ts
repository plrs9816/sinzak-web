import { Category } from "@lib/resources/category";

type BuildFormMode =
  | {
      type: "sell";
      width: number;
      vertical: number;
      height: number;
    }
  | {
      type: "workSell";
    }
  | {
      type: "workBuy";
    };

export type BuildForm = Partial<
  BuildFormMode & {
    category: Category;
    title: string;
    content: string;
    suggest: boolean;
    price: number;
  }
> & {
  images: [string, File][];
};
