import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import api from "@/auth/api";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    ArrowLeft,
    CheckCircle2,
    Trophy,
    Target,
    TrendingUp,
    TrendingDown,
    Activity,
    CalendarDays,
    Star,
    Circle
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

interface Athlete {
    id: number;
    firstname: string;
    lastname: string;
}

interface Sport {
    id: number;
    name: string;
}

interface PerformanceSummary {
    sportId: number;
    sportName: string;
    totalSessions: number;
    completedSessions: number;
    completionPercentage: number;
    bestResult: string | null;
}

interface PerformanceChartPoint {
    date: string;
    targetTime: string;
    actualTime: string | null;
    comparisonPercentage: number | null;
}

interface PerformanceResponse {
    summary: PerformanceSummary;
    chart: PerformanceChartPoint[];
}

function PerformancePage() {
    const navigate = useNavigate();

    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [sports, setSports] = useState<Sport[]>([]);
    const [performance, setPerformance] =
        useState<PerformanceResponse | null>(null);

    const [selectedAthlete, setSelectedAthlete] = useState("");
    const [selectedSport, setSelectedSport] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("30");

    const [loadingAthletes, setLoadingAthletes] = useState(true);
    const [loadingPerformance, setLoadingPerformance] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const getData = async () => {
            try {
                const [athletesResponse, sportsResponse] = await Promise.all([
                    api.get("/athletes"),
                    api.get("/sports")
                ]);

                setAthletes(athletesResponse.data.content);
                setSports(sportsResponse.data);
            } catch (error) {
                console.error("Failed to load data:", error);
                setErrorMessage("Failed to load data.");
            } finally {
                setLoadingAthletes(false);
            }
        };

        getData();
    }, []);

    useEffect(() => {
        if (!selectedAthlete || !selectedSport) {
            setPerformance(null);
            return;
        }

        const getPerformance = async () => {
            setLoadingPerformance(true);
            setErrorMessage("");

            try {
                const response = await api.get(
                    `/performance/athlete/${selectedAthlete}`,
                    {
                        params: {
                            sportId: Number(selectedSport),
                            days:
                                selectedPeriod === "all"
                                    ? null
                                    : Number(selectedPeriod)
                        }
                    }
                );

                setPerformance(response.data);
            } catch (error) {
                console.error("Failed to fetch performance:", error);
                setErrorMessage("Failed to load performance.");
            } finally {
                setLoadingPerformance(false);
            }
        };

        getPerformance();
    }, [selectedAthlete, selectedSport, selectedPeriod]);

    const getSeconds = (time: string) => {
        const [hours, minutes, seconds] = time.split(":").map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    const formatPerformanceTime = (value: number) => {
        const minutes = Math.floor(value / 60);
        const seconds = value % 60;

        if (minutes === 0) {
            return `${seconds.toFixed(2)}s`;
        }

        return `${minutes}:${String(Math.floor(seconds)).padStart(2, "0")}.${String(
    Math.round((seconds % 1) * 100)
).padStart(2, "0")}`;
    };

    const selectedAthleteObject = athletes.find(
        athlete => String(athlete.id) === selectedAthlete
    );

    const selectedSportObject = sports.find(
        sport => String(sport.id) === selectedSport
    );

    const chartData = useMemo(() => {
        if (!performance) return [];

        return performance.chart.map(point => ({
            date: new Date(point.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short"
            }),
            fullDate: new Date(point.date).toLocaleDateString("en-GB"),
            target: getSeconds(point.targetTime),
            actual: point.actualTime
                ? getSeconds(point.actualTime)
                : null
        }));
    }, [performance]);

    const completedPerformances = useMemo(
        () =>
            performance?.chart.filter(
                point => point.actualTime !== null
            ) ?? [],
        [performance]
    );

    const latestPerformance = completedPerformances.at(-1) ?? null;
    const previousPerformance = completedPerformances.at(-2) ?? null;

    const progressPercentage = useMemo(() => {
        if (!latestPerformance?.actualTime || !previousPerformance?.actualTime) {
            return null;
        }

        const latest = getSeconds(latestPerformance.actualTime);
        const previous = getSeconds(previousPerformance.actualTime);

        if (previous === 0) return null;

        return ((previous - latest) / previous) * 100;
    }, [latestPerformance, previousPerformance]);

    const currentComparison =
        latestPerformance?.comparisonPercentage ?? null;

    const actualValues = chartData
        .map(point => point.actual)
        .filter(value => value !== null) as number[];

    const bestActual =
        actualValues.length > 0 ? Math.min(...actualValues) : null;

    return (
        <main className="container mx-auto min-h-[70vh] px-6 py-10">
            <div className="mb-8 flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate("/coach")}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>

                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Athlete Performance
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Monitor progress, consistency and results.
                    </p>
                </div>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                    <CardDescription>
                        Select an athlete and event to analyse performance.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Select
                            value={selectedAthlete}
                            onValueChange={value =>
                                setSelectedAthlete(value ?? "")
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select athlete">
                                    {selectedAthleteObject
                                        ? `${selectedAthleteObject.firstname} ${selectedAthleteObject.lastname}`
                                        : undefined}
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent>
                                {loadingAthletes ? (
                                    <SelectItem value="loading" disabled>
                                        Loading athletes...
                                    </SelectItem>
                                ) : (
                                    athletes.map(athlete => (
                                        <SelectItem
                                            key={athlete.id}
                                            value={String(athlete.id)}
                                        >
                                            {athlete.firstname}{" "}
                                            {athlete.lastname}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedSport}
                            onValueChange={value =>
                                setSelectedSport(value ?? "")
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select event">
                                    {selectedSportObject?.name}
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent>
                                {sports.map(sport => (
                                    <SelectItem
                                        key={sport.id}
                                        value={String(sport.id)}
                                    >
                                        {sport.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedPeriod}
                            onValueChange={value =>
                                setSelectedPeriod(value ?? "30")
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="7">
                                    Last 7 days
                                </SelectItem>
                                <SelectItem value="30">
                                    Last 30 days
                                </SelectItem>
                                <SelectItem value="90">
                                    Last 90 days
                                </SelectItem>
                                <SelectItem value="all">
                                    All time
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {!selectedAthlete || !selectedSport ? (
                <Card className="mt-6 border-dashed">
                    <CardContent className="flex min-h-[250px] flex-col items-center justify-center text-center">
                        <Activity className="mb-4 h-10 w-10 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">
                            Select an athlete to begin
                        </h2>
                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                            Choose an athlete, event and period to view their
                            performance history.
                        </p>
                    </CardContent>
                </Card>
            ) : loadingPerformance ? (
                <Card className="mt-6">
                    <CardContent className="flex min-h-[250px] items-center justify-center">
                        <p className="text-muted-foreground">
                            Loading performance data...
                        </p>
                    </CardContent>
                </Card>
            ) : !performance || performance.chart.length === 0 ? (
                <Card className="mt-6 border-dashed">
                    <CardContent className="flex min-h-[250px] flex-col items-center justify-center text-center">
                        <CalendarDays className="mb-4 h-10 w-10 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">
                            No performance data
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            There are no recorded performances for this period.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="mt-6">
                        <h2 className="text-2xl font-semibold">
                            {selectedAthleteObject?.firstname}{" "}
                            {selectedAthleteObject?.lastname}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {performance.summary.sportName} ·{" "}
                            {selectedPeriod === "all"
                                ? "All time"
                                : `Last ${selectedPeriod} days`}
                        </p>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Sessions
                                        </p>
                                        <p className="mt-2 text-2xl font-bold">
                                            {performance.summary.completedSessions}
                                            <span className="text-base font-normal text-muted-foreground">
                                                {" / "}
                                                {performance.summary.totalSessions}
                                            </span>
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            completed
                                        </p>
                                    </div>
                                    <CheckCircle2 className="h-5 w-5 text-dark-blue" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Consistency
                                        </p>
                                        <p className="mt-2 text-2xl font-bold">
                                            {performance.summary.completionPercentage}%
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            training completion
                                        </p>
                                    </div>
                                    <TrendingUp className="h-5 w-5 text-dark-blue" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Best Performance
                                        </p>
                                        <p className="mt-2 text-2xl font-bold">
                                            {performance.summary.bestResult ?? "-"}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            personal best
                                        </p>
                                    </div>
                                    <Trophy className="h-5 w-5 text-dark-blue" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Current Progress
                                        </p>
                                        <p className="mt-2 text-2xl font-bold">
                                            {progressPercentage !== null
                                                ? `${progressPercentage > 0 ? "+" : ""}${progressPercentage.toFixed(1)}%`
                                                : currentComparison !== null
                                                    ? `${currentComparison.toFixed(1)}%`
                                                    : "-"}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            vs previous result
                                        </p>
                                    </div>

                                    {progressPercentage !== null ? (
                                        progressPercentage >= 0 ? (
                                            <TrendingUp className="h-5 w-5 text-dark-blue" />
                                        ) : (
                                            <TrendingDown className="h-5 w-5 text-muted-foreground" />
                                        )
                                    ) : (
                                        <Target className="h-5 w-5 text-dark-blue" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mt-5">
                        <CardHeader>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle>
                                        Performance Progress
                                    </CardTitle>
                                    <CardDescription>
                                        Lower times indicate better performance.
                                    </CardDescription>
                                </div>

                                <div className="flex items-center gap-5 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 fill-current text-dark-blue" />
                                        Best
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Circle className="h-3.5 w-3.5 fill-current text-dark-blue" />
                                        Improved
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-base leading-none">
                                            ◆
                                        </span>
                                        Slower
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="mx-auto h-[280px] w-full max-w-2xl">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={chartData}
                                        margin={{
                                            top: 20,
                                            right: 35,
                                            left: 15,
                                            bottom: 20
                                        }}
                                    >
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={true}
                                            tickMargin={10}
                                            fontSize={11}
                                            padding={{
                                                left: 25,
                                                right: 25
                                            }}
                                        />

                                        <YAxis
                                            axisLine={true}
                                            tickLine={false}
                                            width={65}
                                            domain={["dataMin - 1", "dataMax + 1"]}
                                            reversed
                                            tickFormatter={value =>
                                                formatPerformanceTime(
                                                    Number(value)
                                                )
                                            }
                                        />

                                        <Tooltip
                                            cursor={false}
                                            content={({ active, payload }) => {
                                                if (!active || !payload?.length) {
                                                    return null;
                                                }

                                                const data =
                                                    payload[0]?.payload;

                                                if (!data) return null;

                                                const difference =
                                                    data.actual !== null
                                                        ? data.actual -
                                                          data.target
                                                        : null;

                                                return (
                                                    <div className="rounded-xl border bg-background p-4 shadow-lg">
                                                        <p className="mb-3 text-sm font-semibold">
                                                            {data.fullDate}
                                                        </p>

                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex justify-between gap-8">
                                                                <span className="text-muted-foreground">
                                                                    Actual
                                                                </span>
                                                                <span className="font-semibold">
                                                                    {data.actual !==
                                                                    null
                                                                        ? formatPerformanceTime(
                                                                              data.actual
                                                                          )
                                                                        : "-"}
                                                                </span>
                                                            </div>

                                                            <div className="flex justify-between gap-8">
                                                                <span className="text-muted-foreground">
                                                                    Target
                                                                </span>
                                                                <span className="font-medium">
                                                                    {formatPerformanceTime(
                                                                        data.target
                                                                    )}
                                                                </span>
                                                            </div>

                                                            {difference !== null && (
                                                                <div className="border-t pt-2">
                                                                    <div className="flex justify-between gap-8">
                                                                        <span className="text-muted-foreground">
                                                                            Difference
                                                                        </span>

                                                                        <span className="font-semibold">
                                                                            {Math.abs(
                                                                                difference
                                                                            ).toFixed(
                                                                                2
                                                                            )}
                                                                            s{" "}
                                                                            {difference <
                                                                            0
                                                                                ? "faster"
                                                                                : difference >
                                                                                    0
                                                                                  ? "slower"
                                                                                  : "on target"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }}
                                        />

                                        <Line
                                            type="monotone"
                                            dataKey="actual"
                                            stroke="transparent"
                                            strokeWidth={0}
                                            dot={(props: any) => {
                                                const {
                                                    cx,
                                                    cy,
                                                    payload,
                                                    index
                                                } = props;

                                                if (
                                                    payload.actual === null
                                                ) {
                                                    return null;
                                                }

                                                const actual = payload.actual;

                                                const previous =
                                                    index > 0
                                                        ? chartData[index - 1]
                                                              ?.actual
                                                        : null;

                                                if (actual === bestActual) {
                                                    return (
                                                        <foreignObject
                                                            x={cx - 11}
                                                            y={cy - 11}
                                                            width={22}
                                                            height={22}
                                                        >
                                                            <div className="flex h-[22px] w-[22px] items-center justify-center">
                                                                <Star className="h-[22px] w-[22px] fill-current text-dark-blue" />
                                                            </div>
                                                        </foreignObject>
                                                    );
                                                }

                                                if (
                                                    previous !== null &&
                                                    actual <= previous
                                                ) {
                                                    return (
                                                        <foreignObject
                                                            x={cx - 9}
                                                            y={cy - 9}
                                                            width={18}
                                                            height={18}
                                                        >
                                                            <div className="flex h-[18px] w-[18px] items-center justify-center">
                                                                <Circle className="h-[18px] w-[18px] fill-current text-dark-blue" />
                                                            </div>
                                                        </foreignObject>
                                                    );
                                                }

                                                return (
                                                    <foreignObject
                                                        x={cx - 9}
                                                        y={cy - 9}
                                                        width={18}
                                                        height={18}
                                                    >
                                                        <div className="flex h-[18px] w-[18px] items-center justify-center">
                                                            <span className="text-[18px] leading-[18px] text-muted-foreground">
                                                                ◆
                                                            </span>
                                                        </div>
                                                    </foreignObject>
                                                );
                                            }}
                                            activeDot={{ r: 7 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 fill-current text-dark-blue" />
                                    Personal best
                                </div>

                                <div className="flex items-center gap-2">
                                    <Circle className="h-3.5 w-3.5 fill-current text-dark-blue" />
                                    Improved / same
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-base leading-none">
                                        ◆
                                    </span>
                                    Slower result
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-5">
                        <CardHeader>
                            <CardTitle>Coach Insight</CardTitle>
                            <CardDescription>
                                Quick interpretation of the latest performance.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-muted p-3">
                                    <Target className="h-5 w-5 text-dark-blue" />
                                </div>

                                <div className="space-y-1">
                                    {latestPerformance?.actualTime ? (
                                        <>
                                            <p className="font-medium">
                                                Latest result:{" "}
                                                {latestPerformance.actualTime}
                                            </p>

                                            {currentComparison !== null && (
                                                <p className="text-sm text-muted-foreground">
                                                    The latest result is{" "}
                                                    <span className="font-medium text-foreground">
                                                        {Math.abs(
                                                            currentComparison
                                                        ).toFixed(1)}
                                                        %
                                                    </span>{" "}
                                                    {currentComparison < 0
                                                        ? "below the target."
                                                        : currentComparison > 0
                                                          ? "above the target."
                                                          : "on target."}
                                                </p>
                                            )}

                                            {progressPercentage !== null && (
                                                <p className="text-sm text-muted-foreground">
                                                    Compared with the previous
                                                    result, the athlete has{" "}
                                                    <span className="font-medium text-foreground">
                                                        {Math.abs(
                                                            progressPercentage
                                                        ).toFixed(1)}
                                                        %
                                                    </span>{" "}
                                                    {progressPercentage >= 0
                                                        ? "improved."
                                                        : "slowed down."}
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No completed performance is
                                            available to generate an insight.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {errorMessage && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}
        </main>
    );
}

export default PerformancePage;