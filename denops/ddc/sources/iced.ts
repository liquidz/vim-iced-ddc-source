import {
  BaseSource,
  Candidate,
  Context,
  DdcOptions,
  SourceOptions,
} from "https://deno.land/x/ddc_vim@v0.0.13/types.ts#^";
import { Denops } from "https://deno.land/x/ddc_vim@v0.0.13/deps.ts#^";
import { once } from "https://deno.land/x/denops_std@v1.4.0/anonymous/mod.ts";
import * as unknownutil from "https://deno.land/x/unknownutil@v1.1.0/mod.ts";

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

export class Source extends BaseSource {
  async gatherCandidates(
    denops: Denops,
    _context: Context,
    _ddcOptions: DdcOptions,
    _sourceOptions: SourceOptions,
    _sourceParams: Record<string, unknown>,
    completeStr: string,
  ): Promise<Candidate[]> {
    const kw = completeStr;
    const kwLen = kw.length;
    if (kwLen === 0 || (kw[0] === ":" && kwLen < 2)) {
      return [];
    }

    return new Promise((resolve) => {
      denops.call(
        "iced#ddc#complete",
        denops.name,
        kw,
        once(denops, (response) => {
          if (response instanceof Array) {
            resolve(convertToCandidates(response));
          } else {
            resolve([]);
          }
        })[0],
      );
    });
  }
}
