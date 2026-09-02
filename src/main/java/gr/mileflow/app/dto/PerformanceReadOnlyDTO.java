package gr.mileflow.app.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record PerformanceReadOnlyDTO(
        Summary summary,
        List<ChartPoint> chart
) {
    public record Summary(
            Long sportId,
            String sportName,
            Integer totalSessions,
            Integer completedSessions,
            Double completionPercentage,
            LocalTime bestResult
    ) {}
    public record ChartPoint(
            LocalDateTime date,
            LocalTime targetTime,
            LocalTime actualTime,
            Double comparisonPercentage
    ) {}
}