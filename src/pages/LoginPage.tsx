import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '../components/ui/card';
import {
    AddUsernameValidator,
    type TAddUsernameValidator
} from '../lib/validators/user';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { User } from "lucide-react"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '../lib/utils';
import { AddUser } from '../api/user';

const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<TAddUsernameValidator>({
        resolver: zodResolver(AddUsernameValidator)
    });

    async function AddUsername(data: TAddUsernameValidator) {
        // Handle adding username logic here
        const user = await AddUser(data.username);
        sessionStorage.setItem('user', JSON.stringify(user));
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-800">Welcome to ChatApp</CardTitle>
                    <p className="text-gray-600">Enter your username to get started</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(AddUsername)}>
                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="input"
                                    placeholder="Input username"
                                    className={cn("flex-row", {
                                        "focus-visible:ring-red-500": errors.username
                                    })}
                                    {...register('username')}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Continue
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default LoginPage;