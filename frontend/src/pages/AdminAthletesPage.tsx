import {useEffect, useState} from "react";
import api from "@/auth/api";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight, PersonStanding} from "lucide-react";

interface Athlete {
    id: number;
    firstname: string;
    lastname: string;
    birthday: string;
    gender: "MALE" | "FEMALE";
    username: string;
    email: string;
    coachName: string;
}

interface AthletePage {
    content: Athlete[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

function AdminAthletesPage() {
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getAthletes = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get<AthletePage>("/admin/athletes", {
                params: {page, size: 10, sort: "lastname,asc"}
            });
            setAthletes(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch athletes:", error);
            setError("Failed to load athletes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAthletes();
    }, [page]);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <p className="text-muted-foreground">Loading athletes...</p>
            </div>
        );
    }

    return (
        <main className="min-h-[70vh] bg-[linear-gradient(to_bottom,rgba(148,156,221,0.08),transparent_35%)]">
            <div className="container mx-auto px-6 py-10">
                <div className="mb-10 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(148,156,221,0.18)] text-dark-blue">
                        <PersonStanding className="h-7 w-7"/>
                    </div>
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            SuperAdmin Dashboard
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-h)]">
                            Athletes
                        </h1>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <Card className="overflow-hidden border-0 shadow-[var(--shadow)]">
                    <CardHeader className="border-b bg-[rgba(148,156,221,0.08)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl">Active Athletes</CardTitle>
                                <CardDescription>
                                    View all active athletes registered in MileFlow.
                                </CardDescription>
                            </div>
                            <Badge className="px-3 py-1">SUPERADMIN</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {athletes.length === 0 ? (
                            <div className="py-16 text-center">
                                <PersonStanding className="mx-auto mb-3 h-10 w-10 text-muted-foreground"/>
                                <p className="font-medium">No active athletes found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="bg-[var(--code-bg)] text-left text-xs uppercase tracking-wide text-muted-foreground">
                                        <th className="px-5 py-4 font-semibold">Name</th>
                                        <th className="px-5 py-4 font-semibold">Gender</th>
                                        <th className="px-5 py-4 font-semibold">Birthday</th>
                                        <th className="px-5 py-4 font-semibold">Username</th>
                                        <th className="px-5 py-4 font-semibold">Email</th>
                                        <th className="px-5 py-4 font-semibold">Coach</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {athletes.map(athlete => (
                                        <tr key={athlete.id} className="border-t transition-colors hover:bg-[var(--code-bg)]">
                                            <td className="px-5 py-5 font-medium text-[var(--text-h)]">
                                                {athlete.firstname} {athlete.lastname}
                                            </td>
                                            <td className="px-5 py-5">
                                                <Badge variant="secondary">{athlete.gender}</Badge>
                                            </td>
                                            <td className="px-5 py-5">
                                                {new Date(athlete.birthday).toLocaleDateString("en-GB")}
                                            </td>
                                            <td className="px-5 py-5">{athlete.username}</td>
                                            <td className="px-5 py-5">{athlete.email}</td>
                                            <td className="px-5 py-4">{athlete.coachName}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 0}
                            onClick={() => setPage(previous => previous - 1)}
                        >
                            <ChevronLeft className="mr-1 h-4 w-4"/>
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {page + 1} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage(previous => previous + 1)}
                        >
                            Next
                            <ChevronRight className="ml-1 h-4 w-4"/>
                        </Button>
                    </div>
                )}
            </div>
        </main>
    );
}

export default AdminAthletesPage;