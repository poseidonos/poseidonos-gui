import log from './log';

const xhrMockClass = () => ({
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn()
});

window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);

it('should log a message', () => {
    log.info("test");
    expect(window.XMLHttpRequest).toBeCalled();
})