<div align="center">
<img style="vertical-align: middle;" src="data/icons/com.github.kinten108101.SteamVpk.svg" alt="Project's logo" width="120" height="120" align="center" />
<br />
<h1>Steam VPK</h1>
Add-on manager for Left 4 Dead 2
<br /><br />
  
[![Please Don't ship WIP](https://img.shields.io/badge/Please-Don't%20Ship%20WIP-yellow)](https://dont-ship.it/) [![Please do not theme this app](https://stopthemingmy.app/badge.svg)](https://stopthemingmy.app)

</div>
<div align="center">
<img style="vertical-align: middle;" src="data/mockups/app-v2-dark.png" alt="Preview" width="640" />
</div>
<br />



This is work in progress. Feedback is appreciated!

## Installation

Currently, there is no stable build for this project.

## Development

Require [gtk](https://gitlab.gnome.org/GNOME/gtk) (version 4), [libadwaita](https://gitlab.gnome.org/GNOME/libadwaita), and [libpanel](https://gitlab.gnome.org/GNOME/libpanel)

### Using yarn

Require [yarn](https://yarnpkg.com/getting-started)

Install development dependencies:

```sh
yarn install
```

Generate type definition from GIR files of libraries (libadwaita, libpanel):

```sh
yarn run build:types
```

Build and run project:

```sh
yarn run dev
```

### Using GNOME Builder

> To be added

## License

GPLv3 or later. See [LICENSE](LICENSE).
