import { z } from 'zod';

export const AddUsernameValidator = z.object({
    username: z.string().min(3).max(20),
});

export type TAddUsernameValidator = z.infer<typeof AddUsernameValidator>;