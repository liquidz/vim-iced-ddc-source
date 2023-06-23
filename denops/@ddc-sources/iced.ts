import {
  BaseSource,
  DdcOptions,
  Item,
  SourceOptions,
} from "https://deno.land/x/ddc_vim@v3.4.0/types.ts";
import { Denops } from "https://deno.land/x/ddc_vim@v3.4.0/deps.ts";
import * as lambda from "https://deno.land/x/denops_std@v5.0.1/lambda/mod.ts";
import * as unknownutil from "https://deno.land/x/unknownutil@v1.1.3/mod.ts";

function convertToItems(response: unknown[]): Item[] {
  const items: Item[] = [];
  for (const x of response) {
    if (!unknownutil.isObject(x) || !unknownutil.isString(x.word)) continue;
    const item: Item = { word: x.word };

    if (unknownutil.isString(x.menu)) item["menu"] = x.menu;
    if (unknownutil.isString(x.info)) item["info"] = x.info;
    if (unknownutil.isString(x.kind)) item["kind"] = x.kind;

    items.push(item);
  }
  return items;
}

type Params = {
  minLength: number;
};

export class Source extends BaseSource<Params> {
  override gather(args: {
    denops: Denops;
    options: DdcOptions;
    sourceOptions: SourceOptions;
    sourceParams: Params;
    completeStr: string;
  }): Promise<Item[]> {
    const kw = args.completeStr;
    const kwLen = kw.length;
    if (kwLen === 0 || (kw[0] === ":" && kwLen < args.sourceParams.minLength)) {
      return Promise.resolve([]);
    }

    return new Promise((resolve) => {
      args.denops.call(
        "iced#ddc#complete",
        args.denops.name,
        kw,
        lambda.register(args.denops, (response) => {
          if (response instanceof Array) {
            resolve(convertToItems(response));
          } else {
            resolve([]);
          }
        }),
      );
    });
  }

  params(): Params {
    return {
      minLength: 2,
    };
  }
}
