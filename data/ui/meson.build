ui_templates = [
  'add-addon.blp',
  'add-addon-preview.blp',
  'add-addon-url.blp',
  'addonlist-page.blp',
  'addonlist-row.blp',
  'addonlist-section.blp',
  'download-page.blp',
  'main-window.blp',
  'omnibar-popover.blp',
  'omnibar.blp',
  'preferences-window.blp',
  'new-profile.blp',
]

blueprints = custom_target('blueprints',
  input: files(
    ui_templates
  ),
  output: '.',
  command: [find_program('blueprint-compiler'), 'batch-compile', '@OUTPUT@', '@CURRENT_SOURCE_DIR@', '@INPUT@'],
)
