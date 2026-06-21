import { jest } from '@jest/globals';

export const natsWrapper = {
    client: {
        publish: jest.fn().mockImplementation((subject: string, data: string, callback: (err?: Error) => void) => {
            callback();
        })
    }
};

export const nats_wrapper = natsWrapper;
