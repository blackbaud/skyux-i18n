import {
  getString
} from './get-string';

describe('Get string', () => {
  let resources: any;

  beforeEach(() => {
    resources = {
      'EN-US': {
        'foo': 'bar'
      }
    };
  });

  it('should return a string paired to a key', () => {
    const result = getString(resources, 'EN-US', 'foo');
    expect(result).toEqual('bar');
  });

  it('should return a default string if locale not supported', () => {
    const result = getString(resources, 'FR-CA', 'foo');
    expect(result).toEqual('bar');
  });

  it('should return an empty string if the key does not exist', () => {
    const result = getString(resources, 'EN-US', 'invalid');
    expect(result).toEqual('');
  });
});
