import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, BarChart3, CalendarDays, Users, Mail, Phone, Timer, Trophy, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";
import api from "@/auth/api";

interface Athlete {
    id: number;
    firstname: string;
    lastname: string;
}

interface TrainingSession {
    id: number;
    athleteId: number;
    sportId: number;
    sportName: string;
    sets: number;
    targetTime: string;
    actualTime: string | null;
    sessionDate: string;
    description: string | null;
    status: "PLANNED" | "COMPLETED";
}

function HomePage() {
    const navigate = useNavigate();
    const { authenticated, role } = useContext(AuthContext);
    const [todaySessions, setTodaySessions] = useState<TrainingSession[]>([]);
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const isCoach = authenticated && role === "COACH";

    useEffect(() => {
        if (!isCoach) {
            return;
        }
        const getTodaySessions = async () => {
            setLoadingSessions(true);
            try {
                const response = await api.get("/training-sessions/today");
                setTodaySessions(response.data);
            } catch (error) {
                console.error("Failed to fetch today's training sessions:", error);
            } finally {
                setLoadingSessions(false);
            }
        };
        getTodaySessions();
    }, [isCoach]);

    useEffect(() => {
        if (!isCoach) {
            return;
        }
        const getAthletes = async () => {
            try {
                const response = await api.get("/athletes");
                setAthletes(response.data.content);
            } catch (error) {
                console.error("Failed to fetch athletes:", error);
            }
        };
        getAthletes();
    }, [isCoach]);

    const getAthleteName = (athleteId: number) => {
        const athlete = athletes.find((a) => a.id === athleteId);
        return athlete ? `${athlete.firstname} ${athlete.lastname}` : `Athlete #${athleteId}`;
    };

    const formatTime = (time: string) => {
        return time?.substring(0, 8) ?? "-";
    };

    const completedSessions = todaySessions.filter((session) => session.status === "COMPLETED").length;
    const uniqueAthletes = new Set(todaySessions.map((session) => session.athleteId)).size;

    return (
        <main className="min-h-screen bg-[linear-gradient(135deg,rgba(148,156,221,0.08),rgba(255,255,255,1)_45%,rgba(6,3,55,0.04))] text-[var(--text)]">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_15%,rgba(148,156,221,0.25),transparent_35%),radial-gradient(circle_at_10%_80%,rgba(6,3,55,0.08),transparent_30%)]" />
                <div className="container mx-auto grid min-h-[82vh] items-center gap-16 px-6 py-16 lg:grid-cols-2 lg:py-20">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--accent-bg)] px-4 py-2 text-sm font-semibold text-dark-blue shadow-sm">
                            <Activity className="h-4 w-4" />
                            TRAIN • TRACK • IMPROVE
                        </div>
                        <h1 className="mt-7 text-5xl font-black leading-[1.05] tracking-tight text-[var(--text-h)] md:text-7xl">
                            Train smarter.
                            <span className="block text-dark-blue">Perform better.</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--text)] md:text-xl">
                            MileFlow brings athletes, training programs and performance tracking together in one simple platform built for coaches.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Button size="lg" className="rounded-xl bg-dark-blue px-6 shadow-lg transition-all hover:-translate-y-0.5 hover:opacity-90" onClick={() => navigate("/login")}>
                                Login
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-xl border-[var(--accent-border)] px-6">
                                Explore MileFlow
                            </Button>
                        </div>
                        <div className="mt-10 flex flex-wrap items-center gap-8">
                            <div>
                                <p className="text-3xl font-black text-[var(--text-h)]">1</p>
                                <p className="mt-1 text-sm text-muted-foreground">Platform</p>
                            </div>
                            <div className="h-10 w-px bg-[var(--border)]" />
                            <div>
                                <p className="text-3xl font-black text-[var(--text-h)]">3</p>
                                <p className="mt-1 text-sm text-muted-foreground">Roles</p>
                            </div>
                            <div className="h-10 w-px bg-[var(--border)]" />
                            <div>
                                <p className="text-3xl font-black text-dark-blue">∞</p>
                                <p className="mt-1 text-sm text-muted-foreground">Progress</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-10 -z-10 rounded-full bg-[rgba(148,156,221,0.2)] blur-3xl" />
                        <Card className="overflow-hidden rounded-[2rem] border-[var(--border)] bg-white/90 shadow-2xl backdrop-blur">
                            <CardContent className="p-0">
                                <div className="bg-dark-blue px-6 py-6 text-white">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                                                <Trophy className="h-4 w-4" />
                                                Coach Dashboard
                                            </div>
                                            <h3 className="mt-2 text-2xl font-bold">Training Overview</h3>
                                        </div>
                                        <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold">
                                            ACTIVE
                                        </div>
                                    </div>
                                </div>
                                {!isCoach ? (
                                    <div className="space-y-4 p-6">
                                        <div className="rounded-2xl bg-[var(--code-bg)] p-4 transition-transform hover:-translate-y-0.5">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-bg)] text-dark-blue">
                                                        <Timer className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-[var(--text-h)]">Sprint Session</p>
                                                        <p className="mt-1 text-xs text-muted-foreground">Training program</p>
                                                    </div>
                                                </div>
                                                <span className="font-mono text-lg font-bold text-dark-blue">00:12:50</span>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl bg-[var(--code-bg)] p-4 transition-transform hover:-translate-y-0.5">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-bg)] text-dark-blue">
                                                        <CalendarDays className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-[var(--text-h)]">Next Session</p>
                                                        <p className="mt-1 text-xs text-muted-foreground">Scheduled training</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold text-dark-blue">18:00</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 pt-2">
                                            <div className="rounded-2xl bg-[rgba(148,156,221,0.12)] p-4">
                                                <p className="text-xs text-muted-foreground">Athletes</p>
                                                <p className="mt-1 text-2xl font-black text-[var(--text-h)]">—</p>
                                            </div>
                                            <div className="rounded-2xl bg-[rgba(148,156,221,0.12)] p-4">
                                                <p className="text-xs text-muted-foreground">Sessions</p>
                                                <p className="mt-1 text-2xl font-black text-[var(--text-h)]">—</p>
                                            </div>
                                            <div className="rounded-2xl bg-[rgba(148,156,221,0.12)] p-4">
                                                <p className="text-xs text-muted-foreground">Progress</p>
                                                <p className="mt-1 text-2xl font-black text-dark-blue">—</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 p-6">
                                        {loadingSessions ? (
                                            <div className="py-8 text-center text-sm text-muted-foreground">
                                                Loading today's training...
                                            </div>
                                        ) : todaySessions.length === 0 ? (
                                            <div className="rounded-2xl bg-[var(--code-bg)] p-6 text-center">
                                                <CalendarDays className="mx-auto h-8 w-8 text-dark-blue" />
                                                <p className="mt-3 font-semibold text-[var(--text-h)]">No training sessions today</p>
                                                <p className="mt-1 text-sm text-muted-foreground">Your schedule is clear for today.</p>
                                            </div>
                                        ) : (
                                            <>
                                                {todaySessions.slice(0, 2).map((session) => (
                                                    <div key={session.id} className="rounded-2xl bg-[var(--code-bg)] p-4 transition-transform hover:-translate-y-0.5">
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-bg)] text-dark-blue">
                                                                    <Timer className="h-5 w-5" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="font-semibold text-[var(--text-h)] truncate">{session.sportName}</p>
                                                                    <p className="mt-1 text-xs text-muted-foreground truncate">
                                                                        {getAthleteName(session.athleteId)} · {session.sets} sets
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <span className="shrink-0 font-mono text-sm font-bold text-dark-blue">
                                                                {formatTime(session.targetTime)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {todaySessions.length > 2 && (
                                                    <p className="text-center text-xs font-medium text-muted-foreground">
                                                        +{todaySessions.length - 2} more sessions today
                                                    </p>
                                                )}
                                                <div className="grid grid-cols-3 gap-3 pt-2">
                                                    <div className="rounded-2xl bg-[rgba(148,156,221,0.12)] p-4">
                                                        <p className="text-xs text-muted-foreground">Athletes</p>
                                                        <p className="mt-1 text-2xl font-black text-[var(--text-h)]">{uniqueAthletes}</p>
                                                    </div>
                                                    <div className="rounded-2xl bg-[rgba(148,156,221,0.12)] p-4">
                                                        <p className="text-xs text-muted-foreground">Sessions</p>
                                                        <p className="mt-1 text-2xl font-black text-[var(--text-h)]">{todaySessions.length}</p>
                                                    </div>
                                                    <div className="rounded-2xl bg-[rgba(148,156,221,0.12)] p-4">
                                                        <p className="text-xs text-muted-foreground">Completed</p>
                                                        <p className="mt-1 text-2xl font-black text-dark-blue">{completedSessions}</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            <section className="border-y bg-[var(--social-bg)] py-5">
                <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 text-sm font-medium text-muted-foreground md:gap-x-12">
                    <span className="text-dark-blue">ATHLETES</span>
                    <span>TRAINING</span>
                    <span className="text-dark-blue">PERFORMANCE</span>
                    <span>PROGRESS</span>
                    <span className="text-dark-blue">MILEFLOW</span>
                </div>
            </section>
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-dark-blue">Why MileFlow</p>
                        <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--text-h)] md:text-5xl">
                            Everything your training workflow needs.
                        </h2>
                        <p className="mt-5 text-lg leading-7 text-muted-foreground">
                            Simple tools that keep coaching organized and performance visible.
                        </p>
                    </div>
                    <div className="mt-14 grid gap-6 md:grid-cols-3">
                        <Card className="group rounded-3xl border-[var(--border)] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow)]">
                            <CardContent className="p-7">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-bg)] text-dark-blue transition-transform duration-300 group-hover:scale-110">
                                    <Users className="h-7 w-7" />
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-[var(--text-h)]">Manage Athletes</h3>
                                <p className="mt-3 leading-7 text-muted-foreground">
                                    Create athlete profiles, manage information and keep your roster organized.
                                </p>
                                <div className="mt-6 text-sm font-semibold text-dark-blue">
                                    Stay organized <ArrowRight className="ml-1 inline h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="group rounded-3xl border-[var(--border)] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow)]">
                            <CardContent className="p-7">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-bg)] text-dark-blue transition-transform duration-300 group-hover:scale-110">
                                    <CalendarDays className="h-7 w-7" />
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-[var(--text-h)]">Build Training Programs</h3>
                                <p className="mt-3 leading-7 text-muted-foreground">
                                    Plan sessions with dates, targets, sports and everything your athletes need.
                                </p>
                                <div className="mt-6 text-sm font-semibold text-dark-blue">
                                    Plan with purpose <ArrowRight className="ml-1 inline h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="group rounded-3xl border-[var(--border)] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow)]">
                            <CardContent className="p-7">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-bg)] text-dark-blue transition-transform duration-300 group-hover:scale-110">
                                    <BarChart3 className="h-7 w-7" />
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-[var(--text-h)]">Track Performance</h3>
                                <p className="mt-3 leading-7 text-muted-foreground">
                                    Compare target and actual results and see progress over time.
                                </p>
                                <div className="mt-6 text-sm font-semibold text-dark-blue">
                                    See the progress <ArrowRight className="ml-1 inline h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            <section className="container mx-auto px-6 pb-24">
                <div className="overflow-hidden rounded-[2rem] bg-dark-blue shadow-[var(--shadow)]">
                    <div className="relative px-8 py-16 text-center text-white md:px-16">
                        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[rgba(148,156,221,0.2)] blur-3xl" />
                        <div className="relative">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/60">
                                Your next session starts here
                            </p>
                            <h2 className="mt-4 text-3xl font-black md:text-5xl">
                                Turn training data into better performance.
                            </h2>
                            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
                                Organize your athletes, plan every session and keep your training workflow flowing with MileFlow.
                            </p>
                            <Button size="lg" variant="secondary" className="mt-8 rounded-xl px-6" onClick={() => navigate("/login")}>
                                Enter MileFlow
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="container mx-auto px-6 pb-24">
                <div className="mx-auto max-w-4xl rounded-[2rem] border border-[var(--border)] bg-white px-8 py-12 text-center shadow-[var(--shadow)] md:px-16">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-bg)] text-dark-blue">
                        <Users className="h-7 w-7" />
                    </div>
                    <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-dark-blue">FOR COACHES</p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--text-h)] md:text-4xl">
                        Want to use MileFlow?
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-muted-foreground">
                        Coach accounts are created by the administrator. Contact us to request access.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <div className="group relative">
                            <Button size="lg" className="rounded-xl bg-dark-blue px-6 hover:opacity-90" onClick={() => window.location.href = "mailto:admin@mileflow.gr"}>
                                <Mail className="mr-2 h-4 w-4" />
                                Email Administrator
                            </Button>
                            <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[var(--text-h)] px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                                admin@mileflow.gr
                            </span>
                        </div>
                        <div className="group relative">
                            <Button size="lg" variant="outline" className="rounded-xl px-6" onClick={() => window.location.href = "tel:+306987161696"}>
                                <Phone className="mr-2 h-4 w-4" />
                                Call Administrator
                            </Button>
                            <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[var(--text-h)] px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                                +30 698 716 1696
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default HomePage;