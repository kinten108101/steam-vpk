const_config = {
  'GJS': gjs_console,
  'PACKAGE_VERSION': meson.project_version(),
  'PACKAGE_NAME': APPID,
  'PREFIX': get_option('prefix'),
  'LIBDIR': get_option('prefix') / get_option('libdir'),
}

sources = []

sources_names = [
  'addon-schema.ts',
  'addon-manager.ts',
  'profile-schema.ts',
  'profile-manager.ts',
  'settings.ts',
  'actions.ts',
  'const.ts',
  'errors.ts',
  'id-table.ts',
  'utils.ts',
  'add-addon.ts',
  'addonlist-page.ts',
  'addonlist-widgets.ts',
  'download-page.ts',
  'input-dialog.ts',
  'main-window.ts',
  'omnibar.ts',
  'preferences-window.ts',
  'application.ts',
  'main.ts',
  'sample_addons.ts',
]

sources += files(sources_names)

tsc_out = join_paths(meson.project_build_root(), 'tsc-out')

typescript = custom_target(
  'typescript-compile',
  input: sources,
  build_by_default: true,
  build_always_stale: true,
  command: [ yarn, yarn_args, 'run', 'tsc', '--outDir', tsc_out ],
  depends: yarn_deps,
  output: [ 'tsc-output' ],
)

source_file_elements = ''
foreach name : sources_names
  source_file_elements = ''.join([source_file_elements, '<file>'])
  source_file_elements = ''.join([source_file_elements, name.replace('.ts', '.js')])
  source_file_elements = ''.join([source_file_elements, '</file>'])
endforeach

src_resrc_manifest = configure_file(
  input: 'steam-vpk.src.gresource.xml.in',
  output: 'steam-vpk.src.gresource.xml',
  configuration: {
    'SOURCE_FILES': source_file_elements
  },
)

app_resource = gnome.compile_resources(
  APPID + '.src',
  src_resrc_manifest,
  dependencies: typescript,
  source_dir: tsc_out,
  gresource_bundle: true,
  install: true,
  install_dir: pkgdatadir,
)

app_launcher = configure_file(
  input: 'steam-vpk.in',
  output: APPID,
  configuration: const_config,
  install_dir: get_option('bindir'),
  install_mode: 'rwxr-xr-x',
)
