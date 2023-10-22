export const symbols = {
  loggerService: Symbol('loggerService'),
  postgresDatabaseClient: Symbol('postgresDatabaseClient'),
  uuidService: Symbol('uuidService'),
};

export const coreSymbols = {
  loggerService: symbols.loggerService,
  postgresDatabaseClient: symbols.postgresDatabaseClient,
  uuidService: symbols.uuidService,
};
