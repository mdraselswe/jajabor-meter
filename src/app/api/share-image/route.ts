import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const catboxForm = new FormData();
    catboxForm.append("reqtype", "fileupload");
    catboxForm.append("fileToUpload", file, "jajabor-certificate.png");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const catboxRes = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: catboxForm,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!catboxRes.ok) {
      const errText = await catboxRes.text().catch(() => "");
      return NextResponse.json({ error: "Failed to upload image", details: errText }, { status: 502 });
    }

    const imageUrl = (await catboxRes.text()).trim();
    if (!imageUrl.startsWith("http")) {
      return NextResponse.json({ error: "Invalid response from upload service" }, { status: 502 });
    }

    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error: any) {
    console.error("Share image upload error:", error);
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
  }
}
