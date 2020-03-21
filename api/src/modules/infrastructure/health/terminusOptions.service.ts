import { Injectable } from '@nestjs/common';
import { MemoryHealthIndicator, MongooseHealthIndicator, TerminusOptionsFactory } from '@nestjs/terminus';

@Injectable()
export class TerminusOptionsService implements TerminusOptionsFactory {
  private static readonly MAX_ALLOWED_RSS_MEMORY_USAGE = 350 * 1024 * 1024; // 350MB

  constructor(
    private readonly mongoose: MongooseHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) { }

  createTerminusOptions() {
    return {
      endpoints: [{
        url: '/health',
        healthIndicators: [
          async () => await this.memory.checkRSS('memory', TerminusOptionsService.MAX_ALLOWED_RSS_MEMORY_USAGE),
          async () => await this.mongoose.pingCheck('mongo'),
        ],
      }],
    };

  }
}
