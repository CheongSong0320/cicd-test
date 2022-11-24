import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetCommunityUsageStatusDetailQuery {
    @ApiProperty()
    dong: string;

    @ApiProperty()
    ho: string;

    @ApiPropertyOptional()
    dateFrom?: string;

    @ApiPropertyOptional()
    dateTo?: string;
}
