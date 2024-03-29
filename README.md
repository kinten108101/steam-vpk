<div align="center">
<img style="vertical-align: middle;" src="data/resources/logo/com.github.kinten108101.SteamVPK.svg" alt="Project's logo" width="120" height="120" align="center" />
<br />
<h1>Steam VPK</h1>
<p></p>Add-on manager for Left 4 Dead 2<br/><br/></p>
</div>
<div align="center">
<img style="vertical-align: middle;" src="data/resources/screenshots/windows-v1.png" alt="Preview" />
</div>
<br />

This application is under development - not ready for practical usage. Any feedback, contribution, or feature request is greatly appreciated!

# Installation

Steam VPK is powered by the Add-on Box daemon. [Download it first!](https://github.com/kinten108101/steam-vpk-server)

## Install with GNOME Builder

1. Download [GNOME Builder](https://flathub.org/apps/details/org.gnome.Builder).
2. In Builder, click the "Clone Repository" button at the bottom, using `https://github.com/kinten108101/addon-box.git` as the URL.
3. Click on the popdown button next to build button. Verify that "manifest.json" is the Active Configuration.
3. Click the build button at the top once the project is loaded.

## Install with Flatpak Builder

Download the necessary runtime, SDK, and extension for Flatpak:

```shell
flatpak install org.gnome.Platform//44 org.gnome.Sdk//44 org.freedesktop.Sdk.Extension.node18//22.08
```

Then run the builder tool:

```shell
flatpak-builder --force-clean --user --install build build-aux/com.github.kinten108101.SteamVPK.yml
```

## Install with Meson

Dependencies:

- meson
- yarn
- gjs ^1.76.0
- gtk4 ^4.10.3
- libadwaita ^1.3.3
- blueprint-compiler ^0.8.1 (https://gitlab.gnome.org/jwestman/blueprint-compiler)
- glib-compile-schemas

Clone the repository as above. Then run these commands at this directory:

```shell
yarn install
meson configure build-meson
sudo meson install -C build-meson
```
## Feature ideas
<details>
  <summary>Ideas (may change during development)</summary>
  
- Add-ons
	- [x] View add-ons
	- [ ] Create empty add-on
	- [ ] Delete add-on
	- [ ] Detect existing add-on
	- [ ] Download from Workshop
	- [ ] Download from Gamemaps
	- [x] View add-on details
	- [ ] Modify add-on details
	- [ ] Use multiple archives per add-on
	- [ ] Search add-ons
- Load order
	- [x] View loadorder
	- [ ] Add, remove add-on entry
	- [ ] Move add-on entry
	- [ ] Drag n drop add-on entry
	- [ ] Add, remove, move n drag separator entry
	- [ ] Randomized add-on list
	- [ ] Search add-on entry
	- [ ] Detect conflicts between add-on entries
	- [ ] Detect conflicts against external add-ons
- Injection
	- [x] Install add-ons as symlinks
	- [ ] Modify in-game add-on details
- Profiles
	- [ ] View profiles
	- [ ] Create, delete profile
	- [ ] Import, export add-on list
	- [ ] Modify profile details
- Archives
	- [ ] Add archive
	- [ ] Delete archive
	- [ ] Move n drag archive entry in add-on
	- [ ] Archive installation wizard when steam id is found
- (Linux) Patcher
	- [ ] No background music patch
	- [ ] Unchanging background clip patch
	- [ ] Chinese characters patch

</details>
