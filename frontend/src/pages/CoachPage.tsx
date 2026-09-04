import { useEffect, useState } from "react";
import api from "@/auth/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {Users, CalendarDays, UserPlus, ArrowRight, PersonStanding, BarChart3} from "lucide-react";
import { useNavigate } from "react-router";

interface Coach {
    id: number;
    firstname: string;
    lastname: string;
    birthday: string;
}

interface User {
    id: number;
    username: string;
    email: string;
}

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

function CoachPage() {
    const [coach, setCoach] = useState<Coach | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const [todaySessions, setTodaySessions] = useState<TrainingSession[]>([]);
    const [athletes, setAthletes] = useState<Athlete[]>([]);

    useEffect(() => {
        const getCoach = async () => {
            try {
                const response = await api.get("/coaches/me");
                setCoach(response.data);
            } catch (error) {
                console.error("Failed to fetch coach:", error);
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
        getCoach();
        getUser();
    }, []);

    useEffect(() => {
        const getTodaySessions = async () => {
            try {
                const response = await api.get("/training-sessions/today");
                setTodaySessions(response.data);
            } catch (error) {
                console.error("Failed to fetch today's training sessions:", error);
            }
        };

        getTodaySessions();
    }, []);

    useEffect(() => {
        const getAthletes = async () => {
            try {
                const response = await api.get("/athletes");
                setAthletes(response.data.content);
            } catch (error) {
                console.error("Failed to fetch athletes:", error);
            }
        };
        getAthletes();
    }, []);

    if (!coach || !user) {
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
                            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                Coach Dashboard
                            </p>
                            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-h)]">
                                Welcome, {coach.firstname}
                            </h1>
                        </div>
                    </div>
                    <p className="mt-4 max-w-2xl text-muted-foreground">
                        Manage your profile, athletes and training sessions from one place.
                    </p>
                </div>

                <Card className="mx-auto w-full max-w-5xl overflow-hidden shadow-[var(--shadow)]">
                    <CardHeader className="bg-[rgba(148,156,221,0.08)]">
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-2xl">My Profile</CardTitle>
                                <CardDescription>Your personal information</CardDescription>
                            </div>
                            <Badge className="px-3 py-1">COACH</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                        <div>
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-dark-blue">
                                Account
                            </h3>
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
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-dark-blue">
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">First name</p>
                                    <p className="mt-1 text-lg font-medium text-[var(--text-h)]">{coach.firstname}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Last name</p>
                                    <p className="mt-1 text-lg font-medium text-[var(--text-h)]">{coach.lastname}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Birthday</p>
                                    <p className="mt-1 text-lg font-medium text-[var(--text-h)]">
                                        {new Date(coach.birthday).toLocaleDateString("en-GB")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="mx-auto mt-8 grid w-full max-w-5xl gap-6 md:grid-cols-2">
                    <Card className="group border-0 shadow-[var(--shadow)] transition-transform duration-200 hover:-translate-y-1">
                        <CardHeader>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(148,156,221,0.18)] text-dark-blue">
                                <Users className="h-6 w-6" />
                            </div>
                            <CardTitle className="mt-4 text-xl">My Athletes</CardTitle>
                            <CardDescription>
                                Create, view and manage the athletes assigned to you.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button onClick={() => navigate("/coach/athletes/create")} className="bg-dark-blue hover:opacity-90">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Create Athlete
                                </Button>
                                <Button variant="outline" onClick={() => navigate("/coach/athletes")}>
                                    View Athletes
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group border-0 shadow-[var(--shadow)] transition-transform duration-200 hover:-translate-y-1">
                        <CardHeader>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(148,156,221,0.18)] text-dark-blue">
                                <CalendarDays className="h-6 w-6" />
                            </div>
                            <CardTitle className="mt-4 text-xl">Training Program</CardTitle>
                            <CardDescription>
                                Create and manage training sessions for your athletes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => navigate("/coach/program")} className="bg-dark-blue hover:opacity-90">
                                Manage Training Sessions
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                    <Card className="group border-0 shadow-[var(--shadow)] transition-transform duration-200 hover:-translate-y-1">
                        <CardHeader>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(148,156,221,0.18)] text-dark-blue">
                                <BarChart3 className="h-6 w-6" />
                            </div>
                            <CardTitle className="mt-4 text-xl">Performance</CardTitle>
                            <CardDescription>View athlete performance and results.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => navigate("/coach/performance")} className="bg-dark-blue hover:opacity-90">
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
                                <CardDescription className="mt-1">
                                    Your training sessions for today
                                </CardDescription>
                            </div>
                            <Badge className="px-3 py-1">TODAY</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {todaySessions.length === 0 ? (
                            <div className="rounded-2xl bg-[var(--code-bg)] py-10 text-center">
                                <CalendarDays className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                                <p className="font-medium text-[var(--text-h)]">No training sessions today</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    You have no scheduled training sessions for today.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="bg-[var(--code-bg)] text-left text-xs uppercase tracking-wide text-muted-foreground">
                                        <th className="px-5 py-4 font-semibold">Time</th>
                                        <th className="px-5 py-4 font-semibold">Athlete</th>
                                        <th className="px-5 py-4 font-semibold">Sport</th>
                                        <th className="px-5 py-4 font-semibold">Target</th>
                                        <th className="px-5 py-4 font-semibold">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {todaySessions.map((session) => (
                                        <tr key={session.id} className="border-t transition-colors hover:bg-[var(--code-bg)]">
                                            <td className="px-5 py-4 font-mono font-semibold text-dark-blue">
                                                {new Date(session.sessionDate).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </td>
                                            <td className="px-5 py-4 font-medium text-[var(--text-h)]">
                                                {(() => {
                                                    const athlete = athletes.find(a => a.id === session.athleteId);
                                                    return athlete
                                                        ? `${athlete.firstname} ${athlete.lastname}`
                                                        : "Unknown athlete";
                                                })()}
                                            </td>
                                            <td className="px-5 py-4 text-muted-foreground">
                                                {session.sportName}
                                            </td>
                                            <td className="px-5 py-4 font-mono">
                                                {session.targetTime}
                                            </td>
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
                                <Button variant="outline" onClick={() => navigate("/coach/program")}>
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

export default CoachPage;