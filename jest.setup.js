// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Basic fetch API stubs so that NextResponse (which extends Response) is defined in Jest's Node environment.
// They don't implement full spec – only what our tests need.
if (typeof global.Response === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const ResponseStub = class {
    constructor(body = null, init = {}) {
      this._body = body;
      this.status = init.status || 200;
    }
    json = async () => this._body;
    static json(data, init = {}) {
      return new ResponseStub(JSON.stringify(data), {
        ...init,
        headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
      });
    }
  };
  // @ts-ignore
  global.Response = ResponseStub;
}
if (typeof global.Headers === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.Headers = class {};
}
if (typeof global.Request === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.Request = class {};
}

// Mock Next.js useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));
