import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("email_addresses").insert({
      email: email,
    });

    console.log(error);
    // Ignore duplicated email address
    if (error && error.code != "23505") {
      return NextResponse.json(error, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
