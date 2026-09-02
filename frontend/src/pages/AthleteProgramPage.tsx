import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "@/auth/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, CalendarDays } from "lucide-react";

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

function AthleteProgramPage() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<TrainingSession[]>([]);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const getSessions = async () => {
        setLoadingSessions(true);
        setErrorMessage("");
        try {
            const response = await api.get<TrainingSessionPage>("/training-sessions/me", {
                params: {
                    page,
                    size: 10
                }
            });
            setSessions(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch training sessions:", error);
            setErrorMessage("Failed to load your training program.");
        } finally {
            setLoadingSessions(false);
        }
    };

    useEffect(() => {
        getSessions();
    }, [page]);

    return (
        <main className="container mx-auto min-h-[70vh] px-6 py-10">
            <div className="mb-8 flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigate("/athlete")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Training Program</h1>
                    <p className="mt-1 text-muted-foreground">View your scheduled training sessions.</p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Training Sessions</CardTitle>
                    <CardDescription>Your personal training program assigned by your coach.</CardDescription>
                </CardHeader>
                <CardContent>
                    {errorMessage && (
                        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}
                    {loadingSessions ? (
                        <div className="flex min-h-[250px] items-center justify-center">
                            <p className="text-muted-foreground">Loading your training program...</p>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                            <CalendarDays className="mb-4 h-10 w-10 text-muted-foreground" />
                            <h2 className="text-lg font-semibold">No training sessions</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                You currently have no training sessions assigned.
                            </p>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Sport</TableHead>
                                        <TableHead>Sets</TableHead>
                                        <TableHead>Target Time</TableHead>
                                        <TableHead>Actual Time</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sessions.map((session) => (
                                        <TableRow key={session.id}>
                                            <TableCell>
                                                {new Date(session.sessionDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(session.sessionDate).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </TableCell>
                                            <TableCell>{session.sportName}</TableCell>
                                            <TableCell>{session.sets}</TableCell>
                                            <TableCell>{session.targetTime}</TableCell>
                                            <TableCell>{session.actualTime ?? "-"}</TableCell>
                                            <TableCell>{session.description ?? "-"}</TableCell>
                                            <TableCell>{session.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {totalPages > 1 && (
                                <div className="mt-6 flex items-center justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page === 0}
                                        onClick={() => setPage(current => current - 1)}
                                    >
                                        Previous
                                    </Button>
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <Button
                                            key={index}
                                            variant={page === index ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setPage(index)}
                                        >
                                            {index + 1}
                                        </Button>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page === totalPages - 1}
                                        onClick={() => setPage(current => current + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}

export default AthleteProgramPage;