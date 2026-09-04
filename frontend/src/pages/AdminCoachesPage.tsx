import {useEffect, useState} from "react";
import api from "@/auth/api";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {UserRound, Plus, Pencil, UserX, ChevronLeft, ChevronRight} from "lucide-react";

interface Coach {
    id: number;
    firstname: string;
    lastname: string;
    birthday: string;
}

interface CoachPage {
    content: Coach[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

interface CoachForm {
    firstname: string;
    lastname: string;
    birthday: string;
    username: string;
    email: string;
}

const emptyForm: CoachForm = {
    firstname: "",
    lastname: "",
    birthday: "",
    username: "",
    email: ""
};

function AdminCoachesPage() {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
    const [form, setForm] = useState<CoachForm>(emptyForm);
    const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);

    const getCoaches = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get<CoachPage>("/admin/coaches", {
                params: {page, size: 10, sort: "lastname,asc"}
            });
            setCoaches(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch coaches:", error);
            setError("Failed to load coaches.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCoaches();
    }, [page]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setForm(previous => ({...previous, [name]: value}));
    };

    const openCreateForm = () => {
        setEditingCoach(null);
        setForm(emptyForm);
        setTemporaryPassword(null);
        setShowForm(true);
    };

    const openEditForm = (coach: Coach) => {
        setEditingCoach(coach);
        setForm({
            firstname: coach.firstname,
            lastname: coach.lastname,
            birthday: coach.birthday,
            username: "",
            email: ""
        });
        setTemporaryPassword(null);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingCoach(null);
        setForm(emptyForm);
        setTemporaryPassword(null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            setSaving(true);
            setError(null);

            if (editingCoach) {
                await api.put(`/admin/coaches/${editingCoach.id}`, {
                    firstname: form.firstname,
                    lastname: form.lastname,
                    birthday: form.birthday,
                    user: {
                        username: form.username,
                        email: form.email
                    }
                });
                closeForm();
            } else {
                const response = await api.post("/admin/coaches", {
                    firstname: form.firstname,
                    lastname: form.lastname,
                    birthday: form.birthday,
                    user: {
                        username: form.username,
                        email: form.email
                    }
                });
                setTemporaryPassword(response.data.temporaryPassword);
                setForm(emptyForm);
            }

            await getCoaches();
        } catch (error: any) {
            console.error("Failed to save coach:", error);

            setError(
                error.response?.data?.message ||
                "Δεν ήταν δυνατή η δημιουργία του προπονητή."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDeactivate = async (coach: Coach) => {
        const confirmed = window.confirm(
            `Are you sure you want to deactivate ${coach.firstname} ${coach.lastname}?`
        );
        if (!confirmed) return;

        try {
            setError(null);
            await api.delete(`/admin/coaches/${coach.id}`);
            await getCoaches();
        } catch (error) {
            console.error("Failed to deactivate coach:", error);
            setError("Failed to deactivate coach.");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <p className="text-muted-foreground">Loading coaches...</p>
            </div>
        );
    }

    return (
        <main className="min-h-[70vh] bg-[linear-gradient(to_bottom,rgba(148,156,221,0.08),transparent_35%)]">
            <div className="container mx-auto px-6 py-10">
                <div className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(148,156,221,0.18)] text-dark-blue">
                            <UserRound className="h-7 w-7"/>
                        </div>
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                SuperAdmin Dashboard
                            </p>
                            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-h)]">
                                Coaches
                            </h1>
                        </div>
                    </div>
                    <Button onClick={openCreateForm} className="bg-dark-blue hover:opacity-90">
                        <Plus className="mr-2 h-4 w-4"/>
                        Create Coach
                    </Button>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                {temporaryPassword && (
                    <Card className="mb-8 border-[rgba(148,156,221,0.4)]">
                        <CardHeader>
                            <CardTitle>Coach created successfully</CardTitle>
                            <CardDescription>
                                Save this temporary password and provide it to the coach.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                <code className="rounded-lg bg-[var(--code-bg)] px-4 py-2 font-mono">
                                    {temporaryPassword}
                                </code>
                                <Button
                                    variant="outline"
                                    onClick={() => navigator.clipboard.writeText(temporaryPassword)}
                                >
                                    Copy
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                className="mt-3"
                                onClick={() => setTemporaryPassword(null)}
                            >
                                Close
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {showForm && (
                    <Card className="mb-8 shadow-[var(--shadow)]">
                        <CardHeader>
                            <CardTitle>{editingCoach ? "Edit Coach" : "Create Coach"}</CardTitle>
                            <CardDescription>
                                {editingCoach
                                    ? "Update the coach information."
                                    : "Create a new MileFlow coach account."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">First name</label>
                                    <input
                                        name="firstname"
                                        value={form.firstname}
                                        onChange={handleChange}
                                        required
                                        minLength={2}
                                        className="w-full rounded-md border px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Last name</label>
                                    <input
                                        name="lastname"
                                        value={form.lastname}
                                        onChange={handleChange}
                                        required
                                        minLength={2}
                                        className="w-full rounded-md border px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Birthday</label>
                                    <input
                                        type="date"
                                        name="birthday"
                                        value={form.birthday}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-md border px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Username</label>
                                    <input
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        required={!editingCoach}
                                        disabled={!!editingCoach}
                                        className="w-full rounded-md border px-3 py-2 disabled:bg-muted"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required={!editingCoach}
                                        disabled={!!editingCoach}
                                        className="w-full rounded-md border px-3 py-2 disabled:bg-muted"
                                    />
                                </div>
                                <div className="flex items-end justify-end gap-3 md:col-span-2">
                                    <Button type="button" variant="outline" onClick={closeForm}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={saving} className="bg-dark-blue hover:opacity-90">
                                        {saving ? "Saving..." : editingCoach ? "Update Coach" : "Create Coach"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <Card className="overflow-hidden border-0 shadow-[var(--shadow)]">
                    <CardHeader className="border-b bg-[rgba(148,156,221,0.08)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl">Active Coaches</CardTitle>
                                <CardDescription>{coaches.length} coaches on this page</CardDescription>
                            </div>
                            <Badge className="px-3 py-1">SUPERADMIN</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {coaches.length === 0 ? (
                            <div className="py-16 text-center">
                                <UserRound className="mx-auto mb-3 h-10 w-10 text-muted-foreground"/>
                                <p className="font-medium">No active coaches found</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Create the first coach to get started.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="bg-[var(--code-bg)] text-left text-xs uppercase tracking-wide text-muted-foreground">
                                        <th className="px-6 py-4 font-semibold">Name</th>
                                        <th className="px-6 py-4 font-semibold">Birthday</th>
                                        <th className="px-6 py-4 text-right font-semibold">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {coaches.map(coach => (
                                        <tr key={coach.id} className="border-t transition-colors hover:bg-[var(--code-bg)]">
                                            <td className="px-6 py-5 font-medium text-[var(--text-h)]">
                                                {coach.firstname} {coach.lastname}
                                            </td>
                                            <td className="px-6 py-5">
                                                {new Date(coach.birthday).toLocaleDateString("en-GB")}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openEditForm(coach)}
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4"/>
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeactivate(coach)}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <UserX className="mr-2 h-4 w-4"/>
                                                        Deactivate
                                                    </Button>
                                                </div>
                                            </td>
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

export default AdminCoachesPage;