offline_mirror = get_option('offline-mirror')
if offline_mirror != ''
  run_command(
    'yarn',
    'config',
    '--offline',
    'set',
    'yarn-offline-mirror',
    offline_mirror,
    env: { 'HOME': meson.project_build_root() },
    check: true
  )
  yarn_args += [
    '--offline',
    '--prod',
    '--frozen-lockfile',
    '--use-yarnrc', meson.project_build_root() / '.yarnrc'
  ]
endif

configure_file(
	input: 'package.json.in',
	output: 'package.json',
	copy: true,
)

configure_file(
  input: 'yarn.lock.in',
  output: 'yarn.lock',
  copy: true,
)

yarn_args += [
  '--cwd', meson.project_build_root() / 'build-node-env',
]

yarn_deps = custom_target(
  'yarn-deps',
  command: [ yarn, 'install', yarn_args ],
  output: [ 'yarn-deps-out' ],
)

TS_CONFIG = configure_file(
  input: 'tsconfig.json.in',
  output: 'tsconfig.json',
  configuration: {
    'CURRENT_BUILD_DIR': meson.current_build_dir(),
    'PROJECT_SOURCE_ROOT': meson.project_source_root(),
    'PROJECT_BUILD_ROOT': meson.project_build_root(),
    'APP_RDNN': app_rdnn,
    'APP_ID': app_id,
  }
)
