import express,{Request, Response} from "express";
import {and, eq, getTableColumns, ilike, or, sql} from "drizzle-orm";
import {departments, subjects} from "../db/schema";
import {db} from "../db"

const router = express.Router();

// Get all subjects with optional search, filtering and pagination.
router.get("/", async (req: Request, res: Response) => {
    try {
        const {search, department,page=1,limit=10} = req.query;

        const currentPage = Math.max(1, Number(page) || 1);
        const limitPerPage = Math.max(1, Number(limit) || 10);
        const offset = (currentPage - 1) * limitPerPage;
        const filterConditions = [];

        // If search query exists, filter by subject name or code.
        if (search) {
            filterConditions.push(
                or(
                    ilike(subjects.name, `%${search}%`),
                    ilike(subjects.code, `%${search}%`),
                )
            )
        }

        // If department filter exists, match department name.
        if (department) {
            filterConditions.push(ilike(departments.name, `%${department}%`))
        }

        const whereConditions = filterConditions.length > 0 ? and(...filterConditions) : undefined;

        const countResult = await db
            .select({count: sql<number>`count(1)`})
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereConditions);
        const totalCount = countResult[0]?.count ?? 0;

        const subjectsList =  await db.select({
            ...getTableColumns(subjects),
            department: {...getTableColumns(departments)}
        }).from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereConditions)
            .orderBy(subjects.createdAt)
            .limit(limitPerPage)
            .offset(offset);

        res.status(200).json({
            data: subjectsList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPerPage),
            }
        });
    } catch (e) {
        console.error(`GET /subjects error: ${e}`);
        res.status(500).json({message: "Something went wrong to get subjects."});
    }
});

export default router;