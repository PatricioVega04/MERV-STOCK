import { z } from "zod";

export const createTaskSchema = z.object({
   title: z.string({ required_error: "Title is required" }).min(2).max(100),
   description: z.string({ required_error: "Description is required" }).min(10).max(1000),
   date: z.string().datetime().optional()
});
