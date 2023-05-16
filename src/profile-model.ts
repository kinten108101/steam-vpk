import GObject from 'gi://GObject';

export interface ProfileManifest {
  name: string;
  id: string;
}

export class Profile extends GObject.Object {
  // @ts-ignore
  public name !: string = this.name;
  // @ts-ignore
  public id !: string = this.id;

  static {
    GObject.registerClass({
      GTypeName: 'Profile',
      Properties: {
        'name': GObject.ParamSpec.string(
          'name',
          'name',
          'name',
          GObject.ParamFlags.READWRITE,
          'default profile',
        ),
        'id': GObject.ParamSpec.string(
          'id',
          'id',
          'id',
          GObject.ParamFlags.READWRITE,
          '01',
        ),
      }
    }, this);
  }
}
