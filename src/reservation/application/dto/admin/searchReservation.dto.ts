import { IsDateString, IsOptional } from 'class-validator';

export class QueryDto {
    /**
     * now
     */
    @IsDateString()
    now: string;

    /**
     * 스테이터스 업데이트 필드 시작 필터
     */
    @IsDateString()
    @IsOptional()
    fromStatusUpdateDate?: string;

    /**
     * 스테이터스 업데이트 필드 종료 필터
     */
    @IsDateString()
    @IsOptional()
    toStatusUpdateDate?: string;
}
