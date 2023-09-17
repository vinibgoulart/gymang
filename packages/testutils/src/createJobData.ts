import type { Job } from 'bull';

// Just to satisfy TypeScript
export const createJobData = <T>(options: Partial<Job<T>>) => options as Job<T>;
