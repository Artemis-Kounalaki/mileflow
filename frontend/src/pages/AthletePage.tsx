import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "@/auth/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowRight, PersonStanding, BarChart3, Activity } from "lucide-react";

interface Athlete {
    id: number;
    firstname: string;
    lastname: string;
    birthday: string;
    gender: string;
}

interface User {
    id: number;
    username: string;
    email: string;
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

interface TrainingSessionPage {
    content: TrainingSession[];
    totalPages: number;
    totalElements: number;
    number: number;
}

function AthletePage() {
    const navigate = useNavigate();
    const [athlete, setAthlete] = useState<Athlete | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [todaySessions, setTodaySessions] = useState<TrainingSession[]>([]);

    useEffect(() => {
        const getAthlete = async () => {
            try {
                const response = await api.get("/athletes/me");
                setAthlete(response.data);
            } catch (error) {
                console.error("Failed to fetch athlete:", error);
            }
        };
        const getUser = async () => {
            try {
                const response = await api.get("/users/me");
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };
        getAthlete();
        getUser();
    }, []);

    useEffect(() => {
        const getTodaySessions = async () => {
            try {
                const response = await api.get<TrainingSessionPage>("/training-sessions/me", {
                    params: { page: 0, size: 100 }
                });
                const today = new Date();
                const sessions = response.data.content.filter((session) => {
                    const sessionDate = new Date(session.sessionDate);
                    return sessionDate.getFullYear() === today.getFullYear()
                        && sessionDate.getMonth() === today.getMonth()
                        && sessionDate.getDate() === today.getDate();
                });
                setTodaySessions(sessions);
            } catch (error) {
                console.error("Failed to fetch today's training sessions:", error);
            }
        };
        getTodaySessions();
    }, []);

    if (!athlete || !user) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <main className="min-h-[70vh] bg-[linear-gradient(to_bottom,rgba(148,156,221,0.08),transparent_35%)]">
            <div className="container mx-auto px-6 py-10">
                <div className="mb-10">
                    <div className="flex items-center gap-3 text-dark-blue">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(148,156,221,0.18)]">
                            <PersonStanding className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Athlete Dashboard</p>
                            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-h)]">Welcome, {athlete.firstname}</h1>
                        </div>
                    </div>
                    <p className="mt-4 max-w-2xl text-muted-foreground">View your profile, training program and performance from one place.</p>
                </div>

                <Card className="mx-auto w-full max-w-5xl overflow-hidden shadow-[var(--shadow)]">
                    <CardHeader className="bg-[rgba(148,156,221,0.08)]">
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-2xl">My Profile</CardTitle>
                                <CardDescription>Your personal information</CardDescription>
                            </div>
                            <Badge className="px-3 py-1">ATHLETE</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                        <div>
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-dark-blue">Account</h3>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">Username</p>
                                    <p className="mt-1 text-lg font-medium text-[var(--text-h)]">{user.username}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="mt-1 text-lg font-medium text-[var(--text-h)]">{user.email}</p>
                                </div>
                            </div>
                        </div>
                        <Separator className="my-8" />
                        <div>
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-dark-blue">Personal Information</h3>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">First name</p>
                                    <p className="mt-1 text-lg font-medium text-[var(--text-h)]">{athlete.firstname}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Last name</p>
                                    <p className="mt-1 text-lg font-medium text-[var(--text-h)]">{athlete.lastname}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Birthday</p>
                                    <p className="mt-1 text-lg font-medium text-[var(--text-h)]">{new Date(athlete.birthday).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Gender</p>
                                    <div className="mt-1"><Badge variant="secondary">{athlete.gender}</Badge></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="mx-auto mt-8 grid w-full max-w-5xl gap-6 md:grid-cols-2">
                    <Card className="group border-0 shadow-[var(--shadow)] transition-transform duration-200 hover:-translate-y-1">
                        <CardHeader>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(148,156,221,0.18)] text-dark-blue">
                                <CalendarDays className="h-6 w-6" />
                            </div>
                            <CardTitle className="mt-4 text-xl">My Training Program</CardTitle>
                            <CardDescription>View your scheduled training sessions assigned by your coach.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => navigate("/athlete/program")} className="bg-dark-blue hover:opacity-90">
                                View Training Program
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="group border-0 shadow-[var(--shadow)] transition-transform duration-200 hover:-translate-y-1">
                        <CardHeader>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(148,156,221,0.18)] text-dark-blue">
                                <BarChart3 className="h-6 w-6" />
                            </div>
                            <CardTitle className="mt-4 text-xl">My Performance</CardTitle>
                            <CardDescription>Monitor your progress, results and performance over time.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => navigate("/athlete/performance")} className="bg-dark-blue hover:opacity-90">
                                View Performance
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mx-auto mt-8 w-full max-w-5xl overflow-hidden rounded-[2rem] border-[var(--border)] bg-white/90 shadow-[var(--shadow)]">
                    <CardHeader className="border-b bg-[rgba(148,156,221,0.08)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    <CalendarDays className="h-4 w-4" />
                                    Today's Schedule
                                </div>
                                <CardTitle className="mt-2 text-2xl">Today's Training</CardTitle>
                                <CardDescription className="mt-1">Your training sessions scheduled for today</CardDescription>
                            </div>
                            <Badge className="px-3 py-1">TODAY</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {todaySessions.length === 0 ? (
                            <div className="rounded-2xl bg-[var(--code-bg)] py-10 text-center">
                                <Activity className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                                <p className="font-medium text-[var(--text-h)]">No training sessions today</p>
                                <p className="mt-1 text-sm text-muted-foreground">You have no scheduled training sessions for today.</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="bg-[var(--code-bg)] text-left text-xs uppercase tracking-wide text-muted-foreground">
                                        <th className="px-5 py-4 font-semibold">Time</th>
                                        <th className="px-5 py-4 font-semibold">Sport</th>
                                        <th className="px-5 py-4 font-semibold">Sets</th>
                                        <th className="px-5 py-4 font-semibold">Target</th>
                                        <th className="px-5 py-4 font-semibold">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {todaySessions.map((session) => (
                                        <tr key={session.id} className="border-t transition-colors hover:bg-[var(--code-bg)]">
                                            <td className="px-5 py-4 font-mono font-semibold text-dark-blue">
                                                {new Date(session.sessionDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </td>
                                            <td className="px-5 py-4 font-medium text-[var(--text-h)]">{session.sportName}</td>
                                            <td className="px-5 py-4">{session.sets}</td>
                                            <td className="px-5 py-4 font-mono">{session.targetTime}</td>
                                            <td className="px-5 py-4">
                                                <Badge variant={session.status === "COMPLETED" ? "default" : "secondary"}>
                                                    {session.status === "COMPLETED" ? "Completed" : "Planned"}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {todaySessions.length > 0 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    {todaySessions.length} {todaySessions.length === 1 ? "session" : "sessions"} scheduled today
                                </p>
                                <Button variant="outline" onClick={() => navigate("/athlete/program")}>
                                    View Training Program
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

export default AthletePage;
