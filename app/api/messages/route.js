import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

export const POST = async (request) => {
  try {
    await connectDB();

    const { name, email, phone, message, property, recipient } =
      await request.json();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user) {
      return new Response(
        JSON.stringify({ message: "You must be logged in to send a message" }),
        { status: 401 }
      );
    }

    const { user } = sessionUser;

    if (user.id == recipient) {
      return new Response(
        JSON.stringify(
          { message: "Cannot send a message to yourself" },
          { status: 400 }
        )
      );
    }

    const newMessage = new Message({
      sender: user.id,
      recipient,
      property,
      email,
      phone,
      body: message,
      name,
    });

    await newMessage.save();

    return new Response(
      JSON.stringify({ message: "Message sent" }, { status: 200 })
    );
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
