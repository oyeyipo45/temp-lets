import { CONSTANTS } from '@Common/constants';
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Config } from '@Common/types';

@ApiTags('Health')
@Controller({ version: '1' })
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private httpHealthIndicator: HttpHealthIndicator,
    private configService: ConfigService<Config, true>,
  ) {}

  @ApiOperation({ summary: 'Check application health' })
  @Get('api/health/application')
  @HealthCheck()
  async healthCheck(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      async (): Promise<HealthIndicatorResult> => ({
        [CONSTANTS.APP_NAME]: { status: 'up' },
      }),
    ]);
  }

  @ApiOperation({ summary: 'Check countries external API health' })
  @Get('api/health/external-api-health')
  @HealthCheck()
  async ExternalApiHealth(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      async (): Promise<HealthIndicatorResult> =>
        this.httpHealthIndicator.pingCheck(
          'external-api-health',
          `${this.configService.get('EXTERNAL_COUNTRIES_SERVICES_URL')}/name/${CONSTANTS.HEALTH_CHECK_COUNTRY}`,
        ),
    ]);
  }
}
