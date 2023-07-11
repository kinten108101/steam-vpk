import GObject from 'gi://GObject';

import { Model } from './mvc.js';
import { Application } from './application.js';
import { Profile } from './profiles.js';

export class SessionData extends GObject.Object implements Model {
  static Signals = {
    CURRENT_PROFILE: 'notify::current-profile',
  };

  static {
    GObject.registerClass({
      GTypeName: 'StvpkSessionData',
      Properties: {
        'current-profile': GObject.ParamSpec.string(
          'current-profile', 'current-profile', 'current-profile',
          GObject.ParamFlags.READWRITE, ''),
      },
    }, this);
  }
  readonly application: Application;
  profiles: Map<string, Profile>;
  currentProfile: Profile;

  constructor(param: {
    application: Application,
  }) {
    const {application, ..._params} = param;
    super(_params || {});
    this.application = param.application;

    this.profiles = new Map();
    const defaultProfile = Profile.makeDefault(this.application.addonStorage);
    this.currentProfile = defaultProfile;
    this.profiles.set(defaultProfile.id, defaultProfile);
  }

  async start() {
    this.notify('current-profile');
  }

  updateCurrentProfileCb() {
    // fit test
    this.notify('current-profile');
  }

  manualUpdateCurrentProfileWithId(val: string) {
    const profile = this.profiles.get(val);
    if (profile === undefined) {
      // fit test
      return;
    }
    this.currentProfile = profile;
    this.notify('current-profile');
  }

  manualUpdateCurrentProfile(val: Profile) {
    if (!this.profiles.has(val.id)) {
      // fit test
      return;
    }
    this.currentProfile = val;
    this.notify('current-profile');
  }
}
