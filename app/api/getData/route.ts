// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { NextRequest, NextResponse } from "next/server";
// import PDFParser from "pdf2json";
// import mammoth from "mammoth";
// import { prompt } from "@/lib/constants";
// import { model } from "@/lib/geminiInitialisation";

// async function getPDFText(file: File): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const pdfParser = new PDFParser();

//     pdfParser.on("pdfParser_dataError", (errData: any) => {
//       reject(new Error(errData.parserError));
//     });

//     pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
//       let text = "";
//       pdfData.Pages.forEach((page: any) => {
//         page.Texts.forEach((textItem: any) => {
//           textItem.R.forEach((run: any) => {
//             text += decodeURIComponent(run.T);
//           });
//         });
//         text += " ";
//       });
//       resolve(text.trim());
//     });

//     file
//       .arrayBuffer()
//       .then((arrayBuffer) => {
//         const buffer = Buffer.from(arrayBuffer);
//         pdfParser.parseBuffer(buffer);
//       })
//       .catch(reject);
//   });
// }

// async function getDOCXText(file: File): Promise<string> {
//   try {
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const result = await mammoth.extractRawText({ buffer });
//     return result.value;
//   } catch (error) {
//     throw new Error(`Failed to parse DOCX file: ${(error as Error).message}`);
//   }
// }

// async function parseFileText(file: File): Promise<string> {
//   const fileName = file.name.toLowerCase();

//   if (fileName.endsWith(".pdf")) {
//     return await getPDFText(file);
//   } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
//     return await getDOCXText(file);
//   } else {
//     throw new Error(
//       "Unsupported file type. Please upload PDF or DOCX files only."
//     );
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const resume = formData.get("resume");
//     const jobDescriptionText = formData.get("jobDescriptionText") as string;
//     const jobDescriptionFile = formData.get("jobDescriptionFile");

//     const resumeText =
//       resume instanceof File ? await parseFileText(resume) : "";
//     const jdText =
//       jobDescriptionFile instanceof File
//         ? await parseFileText(jobDescriptionFile)
//         : jobDescriptionText || "";

//     // --- Gemini call: the ONLY source of analysis ---
//     try {
//       const result = await model.generateContent(prompt(resumeText, jdText));
//       const response = result.response;
//       const responseText = response.text();

//       // Sometimes the model wraps JSON in ```json ... ```
//       const cleanedJsonText = responseText.replace(/```json\n?|\n?```/g, "");

//       const analysisResult = JSON.parse(cleanedJsonText);

//       return NextResponse.json({
//         message: "Success",
//         data: analysisResult,
//       });
//     } catch (err: any) {
//       console.error("Gemini Error:", err);
//       const message = err?.message || "Gemini API call failed";

//       // If quota / rate limit issues – return an error, not fake analysis
//       if (
//         err?.status === 429 ||
//         message.includes("429") ||
//         message.toLowerCase().includes("quota")
//       ) {
//         return NextResponse.json(
//           {
//             message: "Error",
//             error:
//               "Gemini quota or rate limit has been exceeded. Please check your API usage or billing.",
//           },
//           { status: 429 }
//         );
//       }

//       // Any other Gemini error
//       return NextResponse.json(
//         {
//           message: "Error",
//           error: message,
//         },
//         { status: 502 }
//       );
//     }
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { message: "Error", error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }

/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";
import mammoth from "mammoth";
import { prompt, DEFAULT_MODEL_ID } from "@/lib/constants";
import { groqClient } from "@/lib/groqClient";

async function getPDFText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(new Error(errData.parserError));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      let text = "";
      pdfData.Pages.forEach((page: any) => {
        page.Texts.forEach((textItem: any) => {
          textItem.R.forEach((run: any) => {
            text += decodeURIComponent(run.T);
          });
        });
        text += " ";
      });
      resolve(text.trim());
    });

    file
      .arrayBuffer()
      .then((arrayBuffer) => {
        const buffer = Buffer.from(arrayBuffer);
        pdfParser.parseBuffer(buffer);
      })
      .catch(reject);
  });
}

async function getDOCXText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error(`Failed to parse DOCX file: ${(error as Error).message}`);
  }
}

async function parseFileText(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".pdf")) {
    return await getPDFText(file);
  } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
    return await getDOCXText(file);
  } else {
    throw new Error(
      "Unsupported file type. Please upload PDF or DOCX files only."
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resume = formData.get("resume");
    const jobDescriptionText = formData.get("jobDescriptionText") as string;
    const jobDescriptionFile = formData.get("jobDescriptionFile");

    const resumeText =
      resume instanceof File ? await parseFileText(resume) : "";
    const jdText =
      jobDescriptionFile instanceof File
        ? await parseFileText(jobDescriptionFile)
        : jobDescriptionText || "";

    if (!resumeText || !jdText) {
      return NextResponse.json(
        { message: "Error", error: "Missing resume or job description text." },
        { status: 400 }
      );
    }

    // 🔹 Call Groq Chat Completions with JSON mode
    const completion = await groqClient.chat.completions.create({
      model: DEFAULT_MODEL_ID, // e.g. "llama-3.3-70b-versatile"
      messages: [
        {
          role: "system",
          content:
            "You are a precise ATS-style resume analyzer. Always return ONLY valid JSON.",
        },
        {
          role: "user",
          content: prompt(resumeText, jdText),
        },
      ],
      // JSON mode – ensures we get valid JSON string
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { message: "Error", error: "Empty response from Groq model." },
        { status: 502 }
      );
    }

    let analysisResult: any;
    try {
      analysisResult = JSON.parse(content);
    } catch (err) {
      console.error("JSON parse error:", err, "Raw content:", content);
      return NextResponse.json(
        {
          message: "Error",
          error: "Model returned invalid JSON. Please try again.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      message: "Success",
      data: analysisResult,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
