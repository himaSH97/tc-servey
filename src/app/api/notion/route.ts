import { NextResponse } from "next/server";

import { notion } from "~/lib/notion";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    // Prepare the features as a combined string
    const featuresText =
      body?.features?.length > 0
        ? body.features.join(", ") +
          (body.featuresOther ? ` (Other: ${body.featuresOther})` : "")
        : "None";

    // Prepare user type
    const userTypeText =
      body?.userType === "Other"
        ? `Other: ${body?.userTypeOther}`
        : body?.userType || "";

    // Prepare fee structure
    const feeStructureText =
      body?.feeStructure === "Other"
        ? `Other: ${body?.feeStructureOther}`
        : body?.feeStructure || "";

    const response = await notion.pages.create({
      parent: {
        database_id: `${process.env.NOTION_DB}`,
      },
      properties: {
        Name: {
          type: "title",
          title: [
            {
              type: "text",
              text: {
                content: body?.name || "Unknown",
              },
            },
          ],
        },
        Email: {
          type: "email",
          email: body?.email,
        },
        "User Type": {
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: userTypeText,
              },
            },
          ],
        },
        "Interest Level": {
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: body?.interested || "Not specified",
              },
            },
          ],
        },
        "Desired Features": {
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: featuresText,
              },
            },
          ],
        },
        "Willing to Pay": {
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: body?.willingToPay || "Not specified",
              },
            },
          ],
        },
        "Fee Structure Preference": {
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: feeStructureText,
              },
            },
          ],
        },
        "Comfortable Amount": {
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: body?.comfortableAmount || "N/A",
              },
            },
          ],
        },
        "Likelihood Score": {
          type: "rich_text",
          rich_text: body?.likelihood
            ? [
                {
                  type: "text",
                  text: {
                    content: body.likelihood.toString(),
                  },
                },
              ]
            : [],
        },
        "Additional Comments": {
          type: "rich_text",
          rich_text: body?.additionalComments
            ? [
                {
                  type: "text",
                  text: {
                    content: body.additionalComments,
                  },
                },
              ]
            : [],
        },
      },
    });

    if (!response) {
      return NextResponse.json(
        { error: "Failed to add response to Notion" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Response added to Notion", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Notion API Error:", error);
    return NextResponse.json(
      { error: "Failed to add response to Notion", success: false },
      { status: 500 }
    );
  }
}
