import GObject from 'gi://GObject';
import { RestoreItemManifest } from './restore-model';

export interface DataIndexEntry {
  id: string;
}

export interface profileIndexEntry {
  id: string,
}

export interface LoaderItemManifest {
  id: string,
  enabled: boolean,
  in_randomizer?: boolean,
}

export interface LoadingManifest {
  addonlist: LoaderItemManifest[];
}

export interface RestoreManifest {
  list: RestoreItemManifest[];
}

export class LoaderItem extends GObject.Object {
  // @ts-ignore
  public id: string = this.id;
  // @ts-ignore
  public enabled: boolean = this.enabled;
  // @ts-ignore
  public in_randomizer: boolean = this.in_randomizer;

  static {
    GObject.registerClass({
      Properties: {
        'id': GObject.ParamSpec.string(
          'id', 'id',
          'id',
          GObject.ParamFlags.READWRITE, null),
        'enabled': GObject.ParamSpec.boolean(
          'enabled', 'enabled',
          'enabled',
          GObject.ParamFlags.READWRITE, false),
        'in_randomizer': GObject.ParamSpec.boolean(
          'in_randomizer', 'in_randomizer',
          'in_randomizer',
          GObject.ParamFlags.READWRITE, false),
      }
    }, this);
  }
}

export interface DataItemManifest {
  name: string,
  id: string,
  steam_id: string,
  description: string,
  last_update: string,
}

export class DataItem extends GObject.Object {
  // @ts-ignore
  public id: string = this.id;
  // @ts-ignore
  public name: string = this.name;
  // @ts-ignore
  public steam_id: string = this.steam_id;
  // @ts-ignore
  public description: string = this.description;
  // @ts-ignore
  public last_update: string = this.last_update;

  static {
    GObject.registerClass({
      // TODO: Use JS prop instead of GObject prop
      Properties: {
        'name': GObject.ParamSpec.string(
          'name', 'name',
          'name',
          GObject.ParamFlags.READWRITE, 'Unknown'),
        'id': GObject.ParamSpec.string(
          'id', 'id',
          'id',
          GObject.ParamFlags.READWRITE, null),
        'steam_id': GObject.ParamSpec.string(
          'steam_id', 'steam_id',
          'steam_id',
          GObject.ParamFlags.READWRITE, null),
        'description': GObject.ParamSpec.string(
          'description', 'description',
          'description',
          GObject.ParamFlags.READWRITE, 'Unknown description'),
        'last_update': GObject.ParamSpec.string(
          'last_update', 'last_update',
          'last_update',
          GObject.ParamFlags.READWRITE, 'Unknown'),
      }
    }, this);
  }
}

