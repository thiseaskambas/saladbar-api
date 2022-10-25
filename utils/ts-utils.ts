const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

export const parseUri = (uri: unknown): string => {
  if (!uri || !isString(uri)) {
    throw new Error('incorrect or missing uri');
  }
  return uri;
};
