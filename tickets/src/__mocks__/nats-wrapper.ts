export const nats_wrapper = {
    client: {
        publish: jest.fn().mockImplementation((subject: string, data: string, callback: (err?: Error) => void) => {
            callback();
        }
        )
    }
};