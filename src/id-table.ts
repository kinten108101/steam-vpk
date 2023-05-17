import { Errors, StvpkError } from "./errors";

interface IdTableSteam2Stvpk {
  // Use symbol?
  [steam_id: string]: string;
}

let _table_steam_to_stvpk: IdTableSteam2Stvpk = {};

interface IdTableStvpk2Steam {
  // Use symbol?
  [stvpk_id: string]: string;
}

let _table_stvpk_to_steam: IdTableStvpk2Steam = {};

export function id_table_clear() {
  _table_steam_to_stvpk = {};
  _table_stvpk_to_steam = {};
}

export function id_table_append(steam_id: string, stvpk_id: string) {
  _table_steam_to_stvpk[steam_id] = stvpk_id;
  _table_stvpk_to_steam[stvpk_id] = steam_id;
}

/**
 * @throws Errors.ADDON_NOT_USED
 */
export function id_table_get_stvpk_id(steam_id: string): string {
  const val: string | undefined = _table_steam_to_stvpk?.[steam_id];
  if (val === undefined) {
    throw new StvpkError({
      code: Errors.ADDON_NOT_USED,
    });
  }
  return val;
}

/**
 * @throws Errors.ADDON_NOT_DOWNLOADED
 */
export function id_table_get_steam_id(stvpk_id: string): string {
  const val: string | undefined = _table_stvpk_to_steam?.[stvpk_id];
  if (val === undefined) {
    throw new StvpkError({
      code: Errors.ADDON_NOT_DOWNLOADED,
    });
  }
  return val;
}
