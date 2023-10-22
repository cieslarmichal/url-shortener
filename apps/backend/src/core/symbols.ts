export const symbols = {
  loggerService: Symbol('loggerService'),
  postgresDatabaseClient: Symbol('postgresDatabaseClient'),
};

export const coreSymbols = {
  loggerService: symbols.loggerService,
  postgresDatabaseClient: symbols.postgresDatabaseClient,
};
