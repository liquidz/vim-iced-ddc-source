import {
  BaseSource,
  Candidate,
  DdcOptions,
  SourceOptions,
} from "https://deno.land/x/ddc_vim@v0.15.0/types.ts#^";
import { Denops } from "https://deno.land/x/ddc_vim@v0.15.0/deps.ts#^";
import { once } from "https://deno.land/x/denops_std@v2.0.1/anonymous/mod.ts";
import * as unknownutil from "https://deno.land/x/unknownutil@v1.1.3/mod.ts";

function convertToCandidates(response: unknown[]): Candidate[] {
  const candidates: Candidate[] = [];
  for (const x of response) {
    if (!unknownutil.isObject(x) || !unknownutil.isString(x.word)) continue;
    const candidate: Candidate = { word: x.word };

    if (unknownutil.isString(x.menu)) candidate["menu"] = x.menu;
    if (unknownutil.isString(x.info)) candidate["info"] = x.info;
    if (unknownutil.isString(x.kind)) candidate["kind"] = x.kind;

    candidates.push(candidate);
  }
  return candidates;
}

type Params = {};

export class Source extends BaseSource<Params> {
  async gatherCandidates(args: {
    denops: Denops;
    options: DdcOptions;
    sourceOptions: SourceOptions;
    sourceParams: Params;
    completeStr: string;
  }): Promise<Candidate[]> {
    const kw = args.completeStr;
    const kwLen = kw.length;
    if (kwLen === 0 || (kw[0] === ":" && kwLen < 2)) {
      return [];
    }

    return new Promise((resolve) => {
      args.denops.call(
        "iced#ddc#complete",
        args.denops.name,
        kw,
        once(args.denops, (response) => {
          if (response instanceof Array) {
            resolve(convertToCandidates(response));
          } else {
            resolve([]);
          }
        })[0],
      );
    });
  }

  params(): Params {
    return {};
  }
}
