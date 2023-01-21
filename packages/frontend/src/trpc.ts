import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from 'backend/src/trpc/routes';
export const trpc = createTRPCReact<AppRouter>();
