import GLib from 'gi://GLib';

export default {
  init(config: {
    debug: boolean;
  }) {
    GLib.log_set_debug_enabled(config.debug);
    // Avoid overriding logwriter due to issues during shutdown and dragging.
    // The custom logwriter is a JS callback, which couldn't be run during destroy.
  },
}
