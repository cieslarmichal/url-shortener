export const symbols = {
  urlModuleConfig: Symbol('urlModuleConfig'),
  urlRecordMapper: Symbol('urlRecordMapper'),
  urlRecordRepository: Symbol('urlRecordRepository'),
  hashService: Symbol('hashService'),
  createUrlRecordCommandHandler: Symbol('createUrlRecordCommandHandler'),
  findUrlRecordQueryHandler: Symbol('findUrlRecordQueryHandler'),
  urlHttpController: Symbol('urlHttpController'),
};

export const urlSymbols = {
  urlHttpController: symbols.urlHttpController,
};
