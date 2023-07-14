exec_config = configuration_data()
exec_config.set('GJS', gjs_console)
exec_config.set('VERSION', meson.project_version())
exec_config.set('APP_ID', app_id)
exec_config.set('APP_RDNN', app_rdnn)
exec_config.set('APP_FULLNAME', app_fullname)
exec_config.set('APP_SHORTNAME', app_shortname)
exec_config.set('PREFIX', get_option('prefix'))
exec_config.set('DATADIR', get_option('datadir'))
exec_config.set('LIBDIR', get_option('libdir'))
exec_config.set('SRC_DIR', meson.current_source_dir())
exec_config.set('BUILD_TYPE', get_option('buildtype'))

script = [
  'add-addon-window.ts',
  'add-addon.ts',
  'addon-action.ts',
  'addon-storage.ts',
  'addons.ts',
  'application.ts',
  'config.ts',
  'create-profile.ts',
  'download-page.ts',
  'downloader.ts',
  'file.ts',
  'id.ts',
  'index-dir.ts',
  'launchpad.ts',
  'main.ts',
  'mvc.ts',
  'preferences-window.ts',
  'profile-bar.ts',
  'profiles.ts',
  'session-data.ts',
  'utils.ts',
  'window.ts',
]
script_files = files(script)

lib = [
  'utils/action.ts',
  'utils/adw1.ts',
  'utils/code.ts',
  'utils/decorator.ts',
  'utils/errors.ts',
  'utils/file-dialog.ts',
  'utils/gio1.ts',
  'utils/glib1.ts',
  'utils/gtk1.ts',
  'utils/json1.ts',
  'utils/message-dialog.ts',
  'utils/result.ts',
  'utils/revealer.ts',
  'utils/soup1.ts',
  'utils/spinning-button.ts',
  'utils/toast.ts',
  'utils/window-promiser.ts',
  ]
lib_files = files(lib)


tsc_out = join_paths(meson.project_build_root(), 'tsc-out')

_build_root = meson.project_build_root() / '@0@'
typescript = custom_target(
  'typescript-compile',
  input: script_files + lib_files,
  build_by_default: true,
  build_always_stale: true,
  command: [ yarn, yarn_args, 'run', 'tsc',
    '--outDir', tsc_out,
    '--project', _build_root.format(TS_CONFIG) ],
  depends: [ yarn_deps ],
  output: [ 'tsc-output' ],
)

SRC = ''
foreach x : script
  SRC = ''.join([SRC, '<file>'])
  SRC = ''.join([SRC, x.replace('.ts', '.js')])
  SRC = ''.join([SRC, '</file>'])
endforeach

LIB = ''
foreach x : lib
  LIB = ''.join([LIB, '<file>'])
  LIB = ''.join([LIB, x.replace('.ts', '.js')])
  LIB = ''.join([LIB, '</file>'])
endforeach

src_manifest = configure_file(
  input:  'resource.src.gresource.xml.in',
  output: 'resource.src.gresource.xml',
  configuration: {
    'SRC': SRC,
    'LIB': LIB,
    'APP_RDNN': app_rdnn,
  },
)

src_resource = gnome.compile_resources(
  app_id + '.src',
  src_manifest,
  dependencies: typescript,
  source_dir: tsc_out / 'src',
  gresource_bundle: true,
  install: true,
  install_dir: pkgdatadir,
)

app_launcher = configure_file(
  input: 'stvpk.js',
  output: app_id + '.js',
  configuration: exec_config,
)

install_data(
  app_launcher,
  rename: app_id,
  install_dir: get_option('bindir'),
  install_mode: 'rwxrwxrwx',
)
