import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "@/auth/api";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Pencil, Trash2, X, Check } from "lucide-react";

interface Athlete {
    id: number;
    firstname: string;
    lastname: string;
    birthday: string;
    gender: "MALE" | "FEMALE";
    username: string;
    email: string;
}

interface EditAthlete {
    firstname: string;
    lastname: string;
    birthday: string;
    gender: "MALE" | "FEMALE" | "";
    username: string;
    email: string;
}

function AthletesPage() {
    const navigate = useNavigate();
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editAthlete, setEditAthlete] = useState<EditAthlete | null>(null);
    const [saving, setSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [athleteToDelete, setAthleteToDelete] = useState<Athlete | null>(null);

    useEffect(() => {
        const getAthletes = async () => {
            try {
                const response = await api.get("/athletes");
                setAthletes(response.data.content);
            } catch (error) {
                console.error("Failed to fetch athletes:", error);
            } finally {
                setLoading(false);
            }
        };
        getAthletes();
    }, []);

    const handleEdit = (athlete: Athlete) => {
        setErrorMessage("");
        setEditingId(athlete.id);
        setEditAthlete({
            firstname: athlete.firstname,
            lastname: athlete.lastname,
            birthday: athlete.birthday,
            gender: athlete.gender,
            username: athlete.username,
            email: athlete.email,
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditAthlete(null);
        setErrorMessage("");
    };

    const handleSave = async (athleteId: number) => {
        if (!editAthlete) return;
        setSaving(true);
        setErrorMessage("");

        try {
            const response = await api.put(`/athletes/${athleteId}`, {
                firstname: editAthlete.firstname,
                lastname: editAthlete.lastname,
                birthday: editAthlete.birthday,
                gender: editAthlete.gender,
                user: {
                    username: editAthlete.username,
                    email: editAthlete.email,
                },
            });

            const updatedAthlete = response.data;

            setAthletes((currentAthletes) =>
                currentAthletes.map((athlete) =>
                    athlete.id === athleteId
                        ? {
                            ...athlete,
                            firstname: updatedAthlete.firstname,
                            lastname: updatedAthlete.lastname,
                            birthday: updatedAthlete.birthday,
                            gender: updatedAthlete.gender,
                            username: editAthlete.username,
                            email: editAthlete.email,
                        }
                        : athlete
                )
            );

            setEditingId(null);
            setEditAthlete(null);
        } catch (error) {
            console.error("Failed to update athlete:", error);
            setErrorMessage("Failed to update athlete.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!athleteToDelete) return;

        try {
            await api.delete(`/athletes/${athleteToDelete.id}`);

            setAthletes((currentAthletes) =>
                currentAthletes.filter(
                    (athlete) => athlete.id !== athleteToDelete.id));

            setAthleteToDelete(null);
        }
        catch (error) {
            console.error("Failed to delete athlete:", error);
            setErrorMessage("Failed to delete athlete.");
            setAthleteToDelete(null);
        }
    };
    return (
        <main className="container mx-auto min-h-[70vh] px-6 py-10">
            <div className="mb-8 flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigate("/coach")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Athletes</h1>
                    <p className="mt-1 text-muted-foreground">Manage the athletes assigned to you</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Athletes</CardTitle>
                    <CardDescription>{athletes.length} athlete(s)</CardDescription>
                </CardHeader>
                <CardContent>
                    {errorMessage && (
                        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}

                    {loading ? (
                        <div className="py-10 text-center text-muted-foreground">Loading athletes...</div>
                    ) : athletes.length === 0 ? (
                        <div className="py-10 text-center text-muted-foreground">No athletes found.</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>First name</TableHead>
                                    <TableHead>Last name</TableHead>
                                    <TableHead>Birthday</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {athletes.map((athlete) => {
                                    const isEditing = editingId === athlete.id;

                                    return (
                                        <TableRow key={athlete.id}>
                                            {isEditing && editAthlete ? (
                                                <>
                                                    <TableCell>
                                                        <Input
                                                            value={editAthlete.firstname}
                                                            onChange={(e) =>
                                                                setEditAthlete({
                                                                    ...editAthlete,
                                                                    firstname: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            value={editAthlete.lastname}
                                                            onChange={(e) =>
                                                                setEditAthlete({
                                                                    ...editAthlete,
                                                                    lastname: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="date"
                                                            value={editAthlete.birthday}
                                                            onChange={(e) =>
                                                                setEditAthlete({
                                                                    ...editAthlete,
                                                                    birthday: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <select
                                                            value={editAthlete.gender}
                                                            onChange={(e) =>
                                                                setEditAthlete({
                                                                    ...editAthlete,
                                                                    gender: e.target.value as "MALE" | "FEMALE",
                                                                })
                                                            }
                                                            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        >
                                                            <option value="MALE">Male</option>
                                                            <option value="FEMALE">Female</option>
                                                        </select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            value={editAthlete.username}
                                                            onChange={(e) =>
                                                                setEditAthlete({
                                                                    ...editAthlete,
                                                                    username: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="email"
                                                            value={editAthlete.email}
                                                            onChange={(e) =>
                                                                setEditAthlete({
                                                                    ...editAthlete,
                                                                    email: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={handleCancel}
                                                                disabled={saving}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                onClick={() => handleSave(athlete.id)}
                                                                disabled={saving}
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell>{athlete.firstname}</TableCell>
                                                    <TableCell>{athlete.lastname}</TableCell>
                                                    <TableCell>
                                                        {new Date(athlete.birthday).toLocaleDateString("en-GB")}
                                                    </TableCell>
                                                    <TableCell>{athlete.gender}</TableCell>
                                                    <TableCell>{athlete.username}</TableCell>
                                                    <TableCell>{athlete.email}</TableCell>
                                                    <TableCell>
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => handleEdit(athlete)}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="icon"
                                                                onClick={() => setAthleteToDelete(athlete)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <AlertDialog
                open={athleteToDelete !== null}
                onOpenChange={(open: boolean) => {
                    if (!open) setAthleteToDelete(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete athlete?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-medium">
                    {athleteToDelete?.firstname} {athleteToDelete?.lastname}
                </span>
                            ? This action will disable the athlete's account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </main>
    );
}

export default AthletesPage;