import GObject from 'gi://GObject';

export interface IAddonlistItem {
  id: string,
  name: string,
  icon?: string,
  description: string,
  last_update: string,
  in_randomizer?: boolean,
}

export class Js_AddonlistItem extends GObject.Object {}

export const AddonlistItem = GObject.registerClass({
  GTypeName: 'AddonlistItem',
  Properties: {
    id: GObject.ParamSpec.string(
      'id',
      'ID',
      'Identifier number of an add-on item',
      GObject.ParamFlags.READWRITE,
      '',
    ),
    name: GObject.ParamSpec.string(
      'name',
      'Name',
      'Name of an add-on item',
      GObject.ParamFlags.READWRITE,
      '',
    ),
    icon: GObject.ParamSpec.string(
      'icon',
      'Icon',
      'Icon of an add-on item',
      GObject.ParamFlags.READWRITE,
      '',
    ),
    description: GObject.ParamSpec.string(
      'description',
      'Description',
      'Steam Workshop description of an add-on item',
      GObject.ParamFlags.READWRITE,
      '',
    ),
    last_update: GObject.ParamSpec.string(
      'last_update',
      'Last Update',
      'Steam Workshop last update of an add-on item',
      GObject.ParamFlags.READWRITE,
      '21/12/2021',
    ),
    in_randomizer: GObject.ParamSpec.boolean(
      'in_randomizer',
      'In randomizer list',
      'Whether or not item is in randomizer list',
      GObject.ParamFlags.READWRITE,
      false,
    ),
  },
}, Js_AddonlistItem);
