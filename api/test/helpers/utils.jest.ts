export function mockQuery<T>(mock: jest.Mock, value?: T) {
  const entity = mockEntity(value);
  mock.mockImplementation(() => ({ exec: async () => entity }));

  return entity;
}

export function createEmptyQueryMock() {
  return jest.fn().mockImplementation(() => ({
    exec: jest.fn(),
  }));
}

export function mockFilteredQuery<T>(mock: jest.Mock, ...values: T[]) {
  const entities = values.map(mockEntity);
  mock.mockImplementation(() => ({
    countDocuments: jest.fn().mockImplementation(() => ({
      exec: async () => 1,
    })),
    sort: () => ({
      skip: () => ({
        limit: () => ({
          exec: async () => entities,
        }),
      }),
    }),
  }));

  return entities;
}

export function mockEntity<T>(value: T) {
  if (!value) {
    return null;
  }

  const mockSave = jest.fn();
  const mockJSON = jest.fn();
  const mockRemove = jest.fn();
  const entity = {
    ...value,
    save: mockSave,
    toJSON: mockJSON,
    remove: mockRemove,
  };

  mockJSON.mockImplementation(() => entity);
  mockRemove.mockImplementation(async () => entity);
  mockSave.mockImplementation(async () => entity);

  return entity;
}
