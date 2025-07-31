const { StatsD } = require('hot-shots');
const axios = require('axios');
const { setInterval } = require('timers/promises');

class PetFetcher {
    constructor() {
        this.logger = console;
        this.statsd = new StatsD({
            host: '127.0.0.1',
            port: 8125,
            prefix: null,
            errorHandler: (error) => {
                this.logger.error('StatsD error:', error);
            }
        });

        this.httpClient = axios.create({
            baseURL: 'https://petstore.swagger.io/v2',
            timeout: 5000
        });
    }

    async fetchPet() {
        try {
            this.logger.info('Fetching Pet from API...');
            this.statsd.increment('Pet.request.count', { action: 'attempt' });

            const response = await this.httpClient.get('/pet/findByStatus?status=available');
            const pets = response.data;

            if (Array.isArray(pets) && pets.length > 0) {
                const pet = pets[0];
                const petName = pet.name || 'Unnamed';
                this.logger.info(`Fetched Pet: ${petName}`);
            } else {
                this.logger.warn('No pet found in API response.');
            }

            this.statsd.increment('Pet.request.count', { action: 'success' });
        } catch (error) {
            this.logger.error('Failed to fetch Pet:', error.message);
            try {
                this.statsd.increment('Pet.request.count', { action: 'failed' });
            } catch (statsError) {
                this.logger.error('StatsD failed:', statsError.message);
            }
        }
    }

    async start() {
        // Run every 5 seconds
        for await (const _ of setInterval(5000)) {
            await this.fetchPet();
        }
    }

    shutdown() {
        this.statsd.close();
    }
}

// Handle process termination
process.on('SIGTERM', () => {
    fetcher.shutdown();
    process.exit(0);
});

process.on('SIGINT', () => {
    fetcher.shutdown();
    process.exit(0);
});

const fetcher = new PetFetcher();
fetcher.start();