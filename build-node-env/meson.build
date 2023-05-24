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

# Only management-related commands are affected by this "virtual environment" solution.
# Other executables e.g. tsc, eslint, etc still start searching from shell's cwd. 
yarn_args += [
  '--cwd', meson.project_build_root() / 'build-node-env',
]

yarn_deps = custom_target(
  'yarn-deps',
  command: [ yarn, 'install', yarn_args ],
  output: [ 'yarn-deps-out' ],
)