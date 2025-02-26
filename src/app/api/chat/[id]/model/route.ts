import prisma from "../../../../../lib/prisma";
import getSession from "../../../../../lib/getSession";
import { z } from "zod";

const reqSchema = z.object({
  model: z.string(),
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

    const body = reqSchema.safeParse(await req.json());
    if (!body.success) {
      return new Response(JSON.stringify(body.error.errors), { status: 400 });
    }

    const { model } = body.data;

    // Verify chat belongs to user
    const chat = await prisma.chat.findUnique({
      where: {
        id: params.id,
        user_id: session.user.id
      },
    });

    if (!chat) {
      return new Response('Chat not found', { status: 404 });
    }

    // Update the chat model
    const updatedChat = await prisma.chat.update({
      where: {
        id: params.id,
      },
      data: {
        model,
      },
    });

    return new Response(JSON.stringify(updatedChat), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating chat model:', error);
    return new Response('Error updating chat model', { status: 500 });
  }
} 