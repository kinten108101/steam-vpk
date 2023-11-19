logo_path = 'com.github.kinten108101.SteamVPK.svg'

if get_option('buildtype') == 'debug'
  logo_path = 'com.github.kinten108101.SteamVPK.Devel.svg'
endif

configure_file(
  input: logo_path,
  output: 'com.github.kinten108101.SteamVPK.svg',
  install_dir: get_option('datadir') / 'icons' / 'hicolor' / 'scalable' / 'apps',
  copy: true,
)
