import prisma from "../../../../lib/prisma";
import getSession from "../../../../lib/getSession";
import { z } from "zod";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 });
        }

        const chat = await prisma.chat.findUnique({
            where: {
                id: params.id,
                user_id: session.user.id
            },
            select: {
                topic: true,
                model: true
            }
        });

        if (!chat) {
            return new Response('Chat not found', { status: 404 });
        }

        return new Response(JSON.stringify(chat), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching chat:', error);
        return new Response('Error fetching chat', { status: 500 });
    }
}

const updateChatSchema = z.object({
    topic: z.string().optional(),
    model: z.string().optional(),
});

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 });
        }

        // Parse and validate the request body
        const body = await req.json();
        const validatedData = updateChatSchema.safeParse(body);
        
        if (!validatedData.success) {
            return new Response(JSON.stringify({ error: 'Invalid request data', details: validatedData.error }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Check if the chat exists and belongs to the user
        const chat = await prisma.chat.findUnique({
            where: {
                id: params.id,
                user_id: session.user.id
            },
        });

        if (!chat) {
            return new Response('Chat not found', { status: 404 });
        }

        // Update the chat
        const updatedChat = await prisma.chat.update({
            where: {
                id: params.id,
            },
            data: validatedData.data,
        });

        return new Response(JSON.stringify(updatedChat), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error updating chat:', error);
        return new Response('Error updating chat', { status: 500 });
    }
} 