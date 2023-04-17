import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';
import Adw from 'gi://Adw';

class Js_AddonlistItem extends GObject.Object {}

const AddonlistItem = GObject.registerClass({
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
  },
}, Js_AddonlistItem);

const AddonlistRow = GObject.registerClass({
  GTypeName: 'AddonlistRow',
  Properties: {
    'list-item': GObject.ParamSpec.object(
      'list-item',
      'List Item',
      'AddonlistItem object',
      GObject.ParamFlags.READWRITE,
      AddonlistItem.$gtype),
  },
  // @ts-ignore
  Template: 'resource:///com/github/kinten108101/SteamVpk/ui/addonlist-row.ui',
  InternalChildren: [
    'description_field',
    'last_update_field',
  ],
}, class extends Adw.ExpanderRow {

  [props: string]: any;
  constructor(params={}){
    super(params);
    // TODO: Property binding is one-way
    const listitem: Js_AddonlistItem = this.list_item;
    listitem.bind_property('name', this, 'title', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    listitem.bind_property('id', this, 'subtitle', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    const descriptionField: Gtk.Label = this._description_field;
    listitem.bind_property('description', descriptionField, 'label', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
    const lastUpdateField: Gtk.Label = this._last_update_field;
    listitem.bind_property('last_update', lastUpdateField, 'label', GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);
  }
});

export class Js_AddonlistListBox extends Gtk.ListBox {

  // @ts-ignore
  model: Gio.ListStore = undefined;

  constructor(params={}) {
    super(params);
    this.#setupModel();
    this.#setupEntries();
  }

  #setupModel() {
    this.model = Gio.ListStore.new(AddonlistItem.$gtype);
    this.bind_model(this.model, this.#listBoxRowFactory.bind(this) as Gtk.ListBoxCreateWidgetFunc);
  }

  #listBoxRowFactory(entry: Js_AddonlistItem): Gtk.Widget {
    log('Creating a list item widget...');
    return new AddonlistRow({
      'list-item': entry,
    });
  }

  #setupEntries() {
    log('Adding entries...');
    this.model.append(new AddonlistItem({
      name: 'INS:S Louis',
      id: 'insslouis@mav',
      description: `punk ass island biÿtch

Louis dressed in weekend clothing and a tactical vest, from Insurgency Sandstorm.
Features remade UI elements, first person hands, and game accurate models and materials.

Credits:
Nickolox: Painted over portraits and character icons
YuRaNnNzZZ, TFA, kuma: Materialization Method
mav: Model Porting, Project Lead

Note:
You are not allowed to modify, use parts of and create deriative works from contents of this addon without permission. Reuploading any parts of the addon is a direct violation of Steam Workshop Rules, Steam Subscriber Agreement and Steam Online Conduct.`,
      last_update: '11 Nov 2019',
    }));
    this.model.append(new AddonlistItem({
      name: 'Hospital Survivor - Bill',
      id: 'bill-hospital@Someone',
      description:
`Another crappy mod idea of mine. Try to enjoy

This mod includes:
1.Model itself
2.Boomer texture
3.Default vgui
4.'Small' adjustment to fps hands
5.Facials
6.Should work with amy Bill retexture
7. Shoots and fights with just one hand (insert shock emoji here)
8.Passing model

The models i used:
Model 1 click here[sketchfab.com]
Model 2 click here[sketchfab.com]
Model 3 click here[sketchfab.com]

Also open for commissions, yeah`,
      last_update: '30 Mar @ 11:18pm',
    }));
    this.model.append(new AddonlistItem({
      name: 'EFT Ellis bear zasion',
      id: 'ellis-tactical@Animal33',
      description:
`替换Ellis。

Model and material：Battlestate Games
Binding mold：Animal33
material handling：BaiF*ckmouse
HUD：Animal33`,
      last_update: '17 Mar @ 1:08pm',
    }));
    this.model.append(new AddonlistItem({
      name: 'MW2019 FR 5.56',
      id: 'mw2019-fr556@mav',
      description:
`3 round burst bullpup battle rifle. A well placed burst can be extremely deadly at intermittent range.

The FR 5.56 cleaned up. Features fully fixed and accurate game animations, sounds, and materials.

Credits:
Scobalula: Greyhound
YuRaNnNzZZ, TFA, FlamingFox: Materialization Method and Assistance
ThomasCat: Conversion Rig, Animation Porting
mav: Animation Porting, Model Porting, Sound Porting, Project Lead
Biddin: Incendiary Sound

Note:
You are not allowed to modify, use parts of and create deriative works from contents of this addon without permission. Reuploading any parts of the addon is a direct violation of Steam Workshop Rules, Steam Subscriber Agreement and Steam Online Conduct.`,
      last_update: '6 May, 2022 @ 3:12am',
    }));
    this.model.append(new AddonlistItem({
      name: 'COD:MW FAMAS F1 SD Black',
      id: 'mw19-famas-sd@denny',
      description:
`Happy New Year!!!!:D

Replaces Desert Rifle/SCAR
替换SCAR三连发步枪

Yea yea my compile.

Credits:

Infinity Ward - Famas models/textures/Audio
Denny凯妈/Infinity Ward/zmg - Audio
Viper - Original Compile/Ripping/textures/Animations
70R3H - Textures
mav - runidle Animations
Denny凯妈/zmg - Compile/Audio/Texture editing/Animation editing/Fixing
It includes a HUD icon:)
Happy new year! Happy every day!
Enjoy it!

Original part to Garry'mod by Viper click ↓`,
      last_update: '1 Jan @ 8:54am',
    }));
    this.model.append(new AddonlistItem({
      name: 'MW2019 Ellis',
      id: 'mw2019-ellis@Animal33',
      description:
`模型：Modern Warfare2019



替换-Ellis

感谢MLUI的表情修复





---------------------------------------------------------------------

喜欢的也是可以点个赞和收藏`,
      last_update: '8 Sep, 2022 @ 7:30pm',
    }));
  }
}

GObject.registerClass({
  GTypeName: 'AddonlistListBox',
  // @ts-ignore
  Template: 'resource:///com/github/kinten108101/SteamVpk/ui/addonlist-list-box.ui',
}, Js_AddonlistListBox);

