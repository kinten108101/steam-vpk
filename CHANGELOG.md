# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Portal!

- The application should be split into two smaller ones: the front-end (this, Steam VPK) and the back-end (Add-on Box).
  + Async is enforced
  + Possibility of external tools and other clients.
- Main window UI renovation.

## [0.6.0] - 2023-07-31

MVP!

### Added

- Add-on management features. Import an add-on from Workshop, or remove add-on from working repository (move to trash). Add add-on to load order (use). Manipulate the load order by moving entry up, down, drag-n-drop remove entry (disuse), etc.
- Hidden window for debugging which can be activated with Ctrl+H. This window lists (almost) all actions in the app.
- A panel in the Repository page for overview info of add-ons.
- Add-on archives can now be downloaded from Workshop and installed into game!  Although UI is unfinished and there are various performance issues.

### Changed

- Simplified some internal modules e.g. index-dir and addon-storage.

### Removed

- Deprecated XXX1 namespaces.
- Deprecated Result.
- Deprecated Config in favor of Const.
- Deprecated Log.

## [0.5.0] - 2023-07-03

First (late) changelog entry!

### Added

- XXX1 namespaces! Experimental shorthands and components.
- Result! a new pattern as an alternative to try-catch. This is purely experimental, and so far it only triumpths over try-catch in terms of aesthetics.
- Log is a logger module inspired (in appearance) by log from Rust.
- Config is an experimental singleton where you can set shared values during initialization. Convenient for unit testing.

### Removed

- The app's model is being reworked. Some features are missing, and some are planned to be cut.
- eslint and prettier no more.

### Changed

- Transition from Evan Welsh's gi-ts to gjsify's ts-for-gir.
- Transition from whole git submodule to NPM packages (@girs/xxx) for type definition libararies. Unfornately libpanel types aren't available for download, so I pregenerated it and keep it in `lib/@girs/panel-1` for now (there are plans to move away from libpanel).
- `build-node-env` now has its own tsconfig to facilitate the two transitions above.
- Various renames, mostly for data types in the model.
- Transition from single-window app to multi-window app, which is reflected in the overall architecture.


## [0.4.0] - 2023-05-29

### Summary

- New GJS TypeScript stack

## [0.3.0] - 2023-05-21

### Summary

- Profile system, basic application model

## [0.2.0] - 2023-04-17

### Summary

- New interface layout

## [0.1.0] - 2023-04-10

### Summary

- Minimum interface
