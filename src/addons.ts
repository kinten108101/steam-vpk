
export interface StorageExport {
  addondetails: {
    stvpkid?: string,
    publishedfileid?: string,
    time_updated?: Number,
    title?: string,
    description?: string,
    tags?: { tag: string }[],
  }
}

export enum AddonFlag {
  INSTALLED,
  UNKNOWN,
}

export interface AddonManifest {
  stvpkid: string,
  publishedfileid?: string,
  time_updated?: Number,
  title?: string,
  description?: string,
  tags?: { tag: string }[],
  comment?: string,
}

export const AddonManifest = {
  new_from_published_file_details(response: any, stvpkid: string) {
    const manifest: AddonManifest = {
      stvpkid,
      publishedfileid: String(response.publishedfileid),
      time_updated: Number(response.time_updated),
      title: response.title,
      description: String(response.description),
      tags: (() => {
            const arr = response.tags;
            if (arr === undefined) {
              console.warn('GetPublishedFileDetails is missing the tags field.');
              return arr;
            }
            if (!Array.isArray(arr)) {
              console.warn('GetPublishedFileDetails has incorrect tags field.');
              return undefined;
            }
            const newArr: { tag: string }[] = [];
            arr.forEach(x => {
              const tag = x.tag;
              if (typeof tag !== 'string') {
                console.warn('GetPublishedFileDetails has incorrect tag field.');
                return undefined;
              }
              newArr.push(x);
            });
            return newArr;
          })(),
    };
    return manifest;
  },
}

export class Addon {
  static new_from_manifest(manifest: AddonManifest) {
    return new Addon({
      vanityId: manifest.stvpkid,
      steamId: manifest.publishedfileid,
      title: manifest.title,
      description: manifest.description,
      categories: (() => {
              if (manifest.tags === undefined) return new Map();
              const arr = manifest.tags?.map(({ tag }) => {
                return tag;
              });
              const map = new Map<string, {}>();
              arr.forEach(x => {
                map.set(x, {});
              });
              return map;
            })(),
      timeUpdated: (() => {
              if (manifest.time_updated === undefined) return undefined;
              const date = new Date(manifest.time_updated.valueOf() * 1000);
              return date;
            })(),
      comment: manifest.comment,
    });
  }

  static toManifest(addon: Addon) {
    const manifest: AddonManifest = {
      stvpkid: addon.vanityId,
      publishedfileid: addon.steamId,
      time_updated: (() => {
            const date = addon.timeUpdated;
            if (date === undefined) return date;
            return Math.floor(date.getTime() / 1000);
          })(),
      title: addon.title,
      description: addon.description,
      tags: (() => {
            const categories = new Map(addon.categories);
            const tags: { tag: string }[] = [];
            categories.forEach((_, key) => tags.push({ tag: key }));
            return tags;
          })(),
      comment: addon.comment,
    };
    return manifest;
  }

  vanityId: string;
  steamId?: string;
  title?: string;
  description?: string;
  categories: Map<string, {}>;
  timeUpdated?: Date;
  comment?: string;

  constructor(param: Addon) {
    this.vanityId = param.vanityId;
    this.steamId = param.steamId;
    this.title = param.title;
    this.description = param.description;
    this.categories = param.categories;
    this.timeUpdated = param.timeUpdated;
    this.comment = param.comment;
  }
}


