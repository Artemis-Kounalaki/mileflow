import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    UserPlus,
    CheckCircle2,
    XCircle,
    Copy,
    ArrowLeft,
} from "lucide-react";

interface CreatedAthlete {
    id: number;
    firstname: string;
    lastname: string;
    birthday: string;
    gender: string;
    username: string;
    temporaryPassword: string;
}

function CreateAthletePage() {
    const navigate = useNavigate();

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [birthday, setBirthday] = useState("");
    const [gender, setGender] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const [createdAthlete, setCreatedAthlete] = useState<CreatedAthlete | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage("");

        const athleteData = {
            firstname,
            lastname,
            birthday,
            gender,
            userInsertDTO: {
                username,
                email,
            },
        };

        try {
            const response = await api.post("/athletes", athleteData);

            console.log("ATHLETE CREATED:", response.data);

            setCreatedAthlete({
                id: response.data.athlete.id,
                firstname: response.data.athlete.firstname,
                lastname: response.data.athlete.lastname,
                birthday: response.data.athlete.birthday,
                gender: response.data.athlete.gender,
                username,
                temporaryPassword: response.data.temporaryPassword,
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(
                    error.response?.data?.message ||
                    "Something went wrong while creating the athlete."
                );
            } else {
                setErrorMessage(
                    "Something went wrong while creating the athlete."
                );
            }
        }
    };

    const handleCopyPassword = async () => {
        if (!createdAthlete) return;
        await navigator.clipboard.writeText(createdAthlete.temporaryPassword);
    };

    if (createdAthlete) {
        return (
            <main className="min-h-[70vh] container mx-auto px-6 py-10 flex items-center justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                            <div>
                                <CardTitle className="text-2xl">
                                    Athlete Created Successfully
                                </CardTitle>
                                <CardDescription>
                                    The athlete account has been created successfully.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">First name</p>
                                <p className="mt-1 font-medium">{createdAthlete.firstname}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Last name</p>
                                <p className="mt-1 font-medium">{createdAthlete.lastname}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Birthday</p>
                                <p className="mt-1 font-medium">
                                    {new Date(createdAthlete.birthday).toLocaleDateString("en-GB")}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Gender</p>
                                <p className="mt-1 font-medium">{createdAthlete.gender}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Username</p>
                                <p className="mt-1 font-medium">{createdAthlete.username}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Athlete ID</p>
                                <p className="mt-1 font-medium">{createdAthlete.id}</p>
                            </div>
                        </div>

                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">
                                Temporary password
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                                <code className="flex-1 rounded bg-muted px-3 py-2 font-mono text-sm">
                                    {createdAthlete.temporaryPassword}
                                </code>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCopyPassword}
                                >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy
                                </Button>
                            </div>
                            <p className="mt-3 text-sm text-muted-foreground">
                                Give this temporary password to the athlete.
                                The athlete must change it on the first login.
                            </p>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button onClick={() => navigate("/coach")}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Coach
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main className="min-h-[70vh] container mx-auto px-6 py-10 flex items-center justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <UserPlus className="h-7 w-7 text-dark-blue" />
                        <div>
                            <CardTitle className="text-2xl">Create Athlete</CardTitle>
                            <CardDescription>Create a new athlete profile</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {errorMessage && (
                        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                            <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                            <div>
                                <p className="font-medium">Failed to create athlete</p>
                                <p className="mt-1 text-sm">{errorMessage}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <h3 className="mb-3 text-sm font-medium">Athlete Information</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="firstname">First name</Label>
                                    <Input
                                        id="firstname"
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                        placeholder="First name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastname">Last name</Label>
                                    <Input
                                        id="lastname"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                        placeholder="Last name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="birthday">Birthday</Label>
                                    <Input
                                        id="birthday"
                                        type="date"
                                        value={birthday}
                                        onChange={(e) => setBirthday(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <select
                                        id="gender"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="" disabled>Select gender</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="mb-3 text-sm font-medium">Account Information</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Username"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="athlete@example.com"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/coach")}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                Create Athlete
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}

export default CreateAthletePage;