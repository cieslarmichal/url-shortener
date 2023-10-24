export const symbols = {
  urlModuleConfig: Symbol('urlModuleConfig'),
  urlRecordMapper: Symbol('urlRecordMapper'),
  urlRecordRepository: Symbol('urlRecordRepository'),
  hashService: Symbol('hashService'),
  createUrlRecordCommandHandler: Symbol('createUrlRecordCommandHandler'),
  findLongUrlQueryHandler: Symbol('findLongUrlQueryHandler'),
  urlHttpController: Symbol('urlHttpController'),
};

export const urlSymbols = {
  urlHttpController: symbols.urlHttpController,
};
