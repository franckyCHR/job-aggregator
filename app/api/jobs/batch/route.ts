import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { ids } = await request.json();

        if (!Array.isArray(ids)) {
            return NextResponse.json({ error: "IDs must be an array" }, { status: 400 });
        }

        const jobs = await prisma.job.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
            orderBy: {
                datePosted: "desc",
            },
        });

        return NextResponse.json(jobs);
    } catch (error) {
        console.error("Error fetching batch jobs:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
