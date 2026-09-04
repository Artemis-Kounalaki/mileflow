import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "@/auth/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface Athlete {
    id: number;
    firstname: string;
    lastname: string;
}
interface Sport {
    id: number;
    name: string;
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
interface NewSession {
    sportId: string;
    sets: string;
    targetTime: string;
    actualTime: string;
    sessionDate: string;
    description: string;
    status: "PLANNED" | "COMPLETED" | "";
}
interface EditSession {
    sportId: string;
    sets: string;
    targetTime: string;
    actualTime: string;
    sessionDate: string;
    description: string;
    status: "PLANNED" | "COMPLETED" | "";
}

function ProgramPage() {
    const navigate = useNavigate();
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [sports, setSports] = useState<Sport[]>([]);
    const [sessions, setSessions] = useState<TrainingSession[]>([]);
    const [selectedAthlete, setSelectedAthlete] = useState<string>("");
    const [loadingAthletes, setLoadingAthletes] = useState(true);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const [adding, setAdding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editSession, setEditSession] = useState<EditSession | null>(null);
    const [sessionToDelete, setSessionToDelete] = useState<TrainingSession | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [newSession, setNewSession] = useState<NewSession>({
        sportId: "",
        sets: "",
        targetTime: "",
        actualTime: "",
        sessionDate: "",
        description: "",
        status: "PLANNED",
    });

    useEffect(() => {
        const getAthletes = async () => {
            try {
                const response = await api.get("/athletes");
                setAthletes(response.data.content);
            } catch (error) {
                console.error("Failed to fetch athletes:", error);
                setErrorMessage("Failed to load athletes.");
            } finally {
                setLoadingAthletes(false);
            }
        };
        const getSports = async () => {
            try {
                const response = await api.get("/sports");
                setSports(response.data);
            } catch (error) {
                console.error("Failed to fetch sports:", error);
                setErrorMessage("Failed to load sports.");
            }
        };
        getAthletes();
        getSports();
    }, []);

    const getSessions = async () => {
        if (!selectedAthlete) return;
        setLoadingSessions(true);
        setErrorMessage("");
        try {
            const response = await api.get(`/training-sessions/athlete/${selectedAthlete}`, {
                params: { page, size: 10 },
            });
            setSessions(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch training sessions:", error);
            setErrorMessage("Failed to load training sessions.");
        } finally {
            setLoadingSessions(false);
        }
    };

    useEffect(() => {
        if (!selectedAthlete) {
            setSessions([]);
            setTotalPages(0);
            setPage(0);
            return;
        }
        getSessions();
    }, [selectedAthlete, page]);

    const resetNewSession = () => {
        setNewSession({
            sportId: "",
            sets: "",
            targetTime: "",
            actualTime: "",
            sessionDate: "",
            description: "",
            status: "PLANNED",
        });
    };

    const handleNewSession = () => {
        setErrorMessage("");
        setAdding(true);
        resetNewSession();
    };

    const handleCancelNewSession = () => {
        setAdding(false);
        resetNewSession();
        setErrorMessage("");
    };

    const handleSaveNewSession = async () => {
        if (!selectedAthlete || !newSession.sportId || !newSession.sets || !newSession.targetTime || !newSession.sessionDate || !newSession.status) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }
        setSaving(true);
        setErrorMessage("");
        try {
            await api.post("/training-sessions", {
                athleteId: Number(selectedAthlete),
                sportId: Number(newSession.sportId),
                sets: Number(newSession.sets),
                targetTime: newSession.targetTime,
                actualTime: newSession.actualTime || null,
                sessionDate: newSession.sessionDate,
                description: newSession.description || null,
                status: newSession.status,
            });
            setAdding(false);
            resetNewSession();
            await getSessions();
        } catch (error) {
            console.error("Failed to create training session:", error);
            setErrorMessage("Failed to create training session.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (session: TrainingSession) => {
        setErrorMessage("");
        setEditingId(session.id);
        setAdding(false);
        setEditSession({
            sportId: String(session.sportId),
            sets: String(session.sets),
            targetTime: session.targetTime,
            actualTime: session.actualTime ?? "",
            sessionDate: session.sessionDate.slice(0, 16),
            description: session.description ?? "",
            status: session.status,
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditSession(null);
        setErrorMessage("");
    };

    const handleSaveEdit = async (sessionId: number) => {
        if (!editSession) return;
        setSaving(true);
        setErrorMessage("");
        try {
            await api.put(`/training-sessions/${sessionId}`, {
                sportId: Number(editSession.sportId),
                sets: Number(editSession.sets),
                targetTime: editSession.targetTime,
                actualTime: editSession.actualTime || null,
                sessionDate: editSession.sessionDate,
                description: editSession.description || null,
                status: editSession.status,
            });
            setEditingId(null);
            setEditSession(null);
            await getSessions();
        } catch (error) {
            console.error("Failed to update training session:", error);
            setErrorMessage("Failed to update training session.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!sessionToDelete) return;
        try {
            await api.delete(`/training-sessions/${sessionToDelete.id}`);
            setSessionToDelete(null);
            await getSessions();
        } catch (error) {
            console.error("Failed to delete training session:", error);
            setErrorMessage("Failed to delete training session.");
            setSessionToDelete(null);
        }
    };

    const selectedAthleteName = athletes.find(
        (athlete) => String(athlete.id) === selectedAthlete
    );

    return (
        <main className="container mx-auto min-h-[70vh] px-6 py-10">
            <div className="mb-8 flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigate("/coach")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Training Program</h1>
                    <p className="mt-1 text-muted-foreground">Manage training sessions for your athletes</p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Select Athlete</CardTitle>
                    <CardDescription>Choose an athlete to view their training program</CardDescription>
                </CardHeader>
                <CardContent>
                    <Select value={selectedAthlete} onValueChange={(value) => { setSelectedAthlete(value ?? ""); setPage(0); }}>
                        <SelectTrigger className="w-full max-w-md">
                            <SelectValue placeholder="Select athlete">
                                {selectedAthleteName ? `${selectedAthleteName.firstname} ${selectedAthleteName.lastname}` : undefined}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {loadingAthletes ? (
                                <SelectItem value="loading" disabled>Loading...</SelectItem>
                            ) : (
                                athletes.map((athlete) => (
                                    <SelectItem key={athlete.id} value={String(athlete.id)}>
                                        {athlete.firstname} {athlete.lastname}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
            {selectedAthlete && (
                <Card className="mt-8">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Training Sessions</CardTitle>
                                <CardDescription>Training program for the selected athlete</CardDescription>
                            </div>
                            <Button onClick={handleNewSession} disabled={adding || editingId !== null}>
                                <Plus className="mr-2 h-4 w-4" />
                                New Program
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {errorMessage && (
                            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {errorMessage}
                            </div>
                        )}
                        {loadingSessions ? (
                            <div className="py-10 text-center text-muted-foreground">Loading training sessions...</div>
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
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {adding && (
                                            <TableRow>
                                                <TableCell>
                                                    <Input
                                                        type="date"
                                                        value={newSession.sessionDate.split("T")[0]}
                                                        onChange={(e) => setNewSession({
                                                            ...newSession,
                                                            sessionDate: `${e.target.value}T${newSession.sessionDate.split("T")[1] || "00:00"}`
                                                        })}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="time"
                                                        value={newSession.sessionDate.split("T")[1] || ""}
                                                        onChange={(e) => setNewSession({
                                                            ...newSession,
                                                            sessionDate: `${newSession.sessionDate.split("T")[0] || ""}T${e.target.value}`
                                                        })}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Select value={newSession.sportId} onValueChange={(value) => setNewSession({ ...newSession, sportId: value ?? "" })}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Sport">
                                                                {sports.find((sport) => String(sport.id) === newSession.sportId)?.name}
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {sports.map((sport) => (
                                                                <SelectItem key={sport.id} value={String(sport.id)}>
                                                                    {sport.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <Input type="number" min="1" value={newSession.sets} onChange={(e) => setNewSession({ ...newSession, sets: e.target.value })} className="w-20" />
                                                </TableCell>
                                                <TableCell>
                                                    <Input type="text" value={newSession.targetTime} onChange={(e) => setNewSession({ ...newSession, targetTime: e.target.value })} placeholder="00:00:12" maxLength={8} />
                                                </TableCell>
                                                <TableCell>
                                                    <Input type="text" value={newSession.actualTime} onChange={(e) => setNewSession({ ...newSession, actualTime: e.target.value })} placeholder="00:00:00" maxLength={8} />
                                                </TableCell>
                                                <TableCell>
                                                    <Input value={newSession.description} onChange={(e) => setNewSession({ ...newSession, description: e.target.value })} placeholder="Description" />
                                                </TableCell>
                                                <TableCell>
                                                    <Select value={newSession.status} onValueChange={(value) => setNewSession({ ...newSession, status: (value ?? "") as "PLANNED" | "COMPLETED" | "" })}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="PLANNED">Planned</SelectItem>
                                                            <SelectItem value="COMPLETED">Completed</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="icon" onClick={handleCancelNewSession} disabled={saving}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="icon" onClick={handleSaveNewSession} disabled={saving}>
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {sessions.map((session) => {
                                            const isEditing = editingId === session.id;
                                            return (
                                                <TableRow key={session.id}>
                                                    {isEditing && editSession ? (
                                                        <>
                                                            <TableCell>
                                                                <Input
                                                                    type="date"
                                                                    value={editSession.sessionDate.split("T")[0]}
                                                                    onChange={(e) => setEditSession({
                                                                        ...editSession,
                                                                        sessionDate: `${e.target.value}T${editSession.sessionDate.split("T")[1] || "00:00"}`
                                                                    })}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    type="time"
                                                                    value={editSession.sessionDate.split("T")[1] || ""}
                                                                    onChange={(e) => setEditSession({
                                                                        ...editSession,
                                                                        sessionDate: `${editSession.sessionDate.split("T")[0] || ""}T${e.target.value}`
                                                                    })}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Select value={editSession.sportId} onValueChange={(value) => setEditSession({ ...editSession, sportId: value ?? "" })}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Sport">
                                                                            {sports.find((sport) => String(sport.id) === editSession.sportId)?.name}
                                                                        </SelectValue>
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {sports.map((sport) => (
                                                                            <SelectItem key={sport.id} value={String(sport.id)}>
                                                                                {sport.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input type="number" min="1" value={editSession.sets} onChange={(e) => setEditSession({ ...editSession, sets: e.target.value })} className="w-20" />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input type="text" value={editSession.targetTime} onChange={(e) => setEditSession({ ...editSession, targetTime: e.target.value })} placeholder="00:00:12" maxLength={8} />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input type="text" value={editSession.actualTime} onChange={(e) => setEditSession({ ...editSession, actualTime: e.target.value })} placeholder="00:00:00" maxLength={8} />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input value={editSession.description} onChange={(e) => setEditSession({ ...editSession, description: e.target.value })} placeholder="Description" />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Select value={editSession.status} onValueChange={(value) => setEditSession({ ...editSession, status: (value ?? "") as "PLANNED" | "COMPLETED" | "" })}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="PLANNED">Planned</SelectItem>
                                                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex justify-end gap-2">
                                                                    <Button variant="outline" size="icon" onClick={handleCancelEdit} disabled={saving}>
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button size="icon" onClick={() => handleSaveEdit(session.id)} disabled={saving}>
                                                                        <Check className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TableCell>{new Date(session.sessionDate).toLocaleDateString("en-GB")}</TableCell>
                                                            <TableCell>{new Date(session.sessionDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</TableCell>
                                                            <TableCell>{session.sportName}</TableCell>
                                                            <TableCell>{session.sets}</TableCell>
                                                            <TableCell>{session.targetTime}</TableCell>
                                                            <TableCell>{session.actualTime ?? "-"}</TableCell>
                                                            <TableCell>{session.description ?? "-"}</TableCell>
                                                            <TableCell>{session.status}</TableCell>
                                                            <TableCell>
                                                                <div className="flex justify-end gap-2">
                                                                    <Button variant="outline" size="icon" onClick={() => handleEdit(session)} disabled={editingId !== null || adding}>
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="destructive" size="icon" onClick={() => setSessionToDelete(session)} disabled={editingId !== null || adding}>
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </>
                                                    )}
                                                </TableRow>
                                            );
                                        })}
                                        {sessions.length === 0 && !adding && (
                                            <TableRow>
                                                <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">No training sessions found.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                {totalPages > 1 && (
                                    <div className="mt-6 flex items-center justify-center gap-2">
                                        <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((current) => current - 1)}>
                                            Previous
                                        </Button>
                                        {Array.from({ length: totalPages }, (_, index) => (
                                            <Button key={index} variant={page === index ? "default" : "outline"} size="sm" onClick={() => setPage(index)}>
                                                {index + 1}
                                            </Button>
                                        ))}
                                        <Button variant="outline" size="sm" disabled={page === totalPages - 1} onClick={() => setPage((current) => current + 1)}>
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
            <AlertDialog open={sessionToDelete !== null} onOpenChange={(open: boolean) => { if (!open) setSessionToDelete(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete training session?</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to delete this training session?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    );
}

export default ProgramPage;