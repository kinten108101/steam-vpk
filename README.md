<img style="vertical-align: middle;" src="data/icons/com.github.kinten108101.SteamVpk.svg" alt="Project's logo" width="120" height="120" align="left">

# Steam VPK

Add-on manager for Left 4 Dead 2

<img style="vertical-align: middle;" src="data/mockups/app-v2-main-page.svg" alt="Project's logo" width="496">

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

Generate type definition from GIR files of libaries (libadwaita, libpanel):

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
