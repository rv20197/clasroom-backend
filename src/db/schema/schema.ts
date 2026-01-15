import {integer, pgTable, varchar,timestamp} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

const timeStamps = {
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(()=> new Date()).notNull(),
}

export const departments = pgTable("departments",{
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    code: varchar('code',{length: 50}).notNull().unique(),
    name: varchar('name',{length: 250}).notNull().unique(),
    description: varchar('description',{length: 250}),
    ...timeStamps,
});

export const subjects = pgTable("subjects",{
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    departmentId: integer('department_id').notNull().references(()=>departments.id,{onDelete: "restrict"}),
    name: varchar('name',{length: 250}).notNull(),
    code: varchar('code',{length: 50}).notNull().unique(),
    description: varchar('description',{length: 250}),
    ...timeStamps,
});

export const departmentRelations = relations(departments,({many})=>({
    subjects: many(subjects)
}));

export const subjectRelations = relations(subjects,({one,many})=> ({
    department: one(departments,{
        fields:[subjects.departmentId],
        references:[departments.id]
    })
}));

export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;

export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;