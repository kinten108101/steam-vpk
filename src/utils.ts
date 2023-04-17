import Gio from 'gi://Gio';

export const getTemplateData = (path: string) => {
  const [, template] = Gio.File.new_for_path(path).load_contents(null);
  return template;
};
