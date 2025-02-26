import prisma from "../../../../lib/prisma";
import getSession from "../../../../lib/getSession";
import { z } from "zod";

const reqSchema = z.object({
    chatId: z.string(),
    content: z.string(),
    model: z.string().optional()
});

export async function POST(req: Request) {
    try {
        const body = reqSchema.safeParse(await req.json());
        if (!body.success) {
            return new Response(JSON.stringify(body.error.errors), { status: 400 });
        }
        const { chatId, content, model = "gpt-4o-mini" } = body.data;
        const session = await getSession();
        const user = session?.user;
        
        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 });
        }

        const new_chat = await prisma.chat.create({
            data: {
                id: chatId,
                user: {
                    connect: {
                        id: user?.id
                    }
                },
                topic: "New chat",
                model: model
            },
            include: {
                messages: true
            }
        });

        const message = await prisma.message.create({
            data: {
                role: 'user',
                content: content,
                chat_id: new_chat.id
            }
        });

        return new Response(JSON.stringify({ chat_id: new_chat.id }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error creating chat:', error);
        return new Response('Error creating chat', { status: 500 });
    }
}