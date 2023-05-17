import GObject from 'gi://GObject';

export interface IAddonlistPageItem {
  name: string;
  id: string;
  enabled: boolean;
  description: string;
  last_update: string;
  in_randomizer?: boolean;
}

export class AddonlistPageItem extends GObject.Object {
  static {
    GObject.registerClass({
      GTypeName: 'AddonlistPageItem',
      Properties: {
        'name': GObject.ParamSpec.string('name', 'name', 'name', GObject.ParamFlags.READWRITE, ''),
        'id': GObject.ParamSpec.string('id', 'id', 'id', GObject.ParamFlags.READWRITE, ''),
        'enabled': GObject.ParamSpec.boolean('enabled', 'enabled', 'enabled', GObject.ParamFlags.READWRITE, true),
        'description': GObject.ParamSpec.string('description', 'description', 'description', GObject.ParamFlags.READWRITE, ''),
        'last_update': GObject.ParamSpec.string('last_update', 'last_update', 'last_update', GObject.ParamFlags.READWRITE, ''),
        'in_randomizer': GObject.ParamSpec.boolean('in_randomizer', 'in_randomizer', 'in_randomizer', GObject.ParamFlags.READWRITE, false),
      }
    }, this);
  }
}
