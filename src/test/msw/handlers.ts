import { http, HttpResponse } from "msw";
let expenses = [
  {
    id: 1,
    description: "Gym Membership",
    amount: 50,
    groupId: 1,
    groupName: "Health",
    createdAt: "2024-01-01T00:00:00Z"
  }
];

export const handlers = [
  http.get("*/expenses", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Number(url.searchParams.get("limit") ?? 10);

    return HttpResponse.json({
      data: expenses,
      total: expenses.length,
      page,
      limit
    });
  }),

  http.get("*/expense-groups", () => {
    return HttpResponse.json({
      data: [
        { id: 1, name: "Health", description: "Health and wellness expenses" },
        { id: 2, name: "Food", description: "Food and dining expenses" }
      ],
      total: 2,
      page: 1,
      limit: 10
    });
  }),

  http.post("*/expenses", async ({ request }) => {
    const body = (await request.json()) as {
        description: string;
        amount: number;
        groupId: number | string;
      };
    
    expenses.push({
        id: 999,
        description: body.description,
        amount: body.amount,
        createdAt: new Date().toISOString(),
        groupId: Number(body.groupId),
        groupName: "Health"
    });
    
    return HttpResponse.json({
        id: 999,
        description: body.description,
        amount: body.amount,
        createdAt: new Date().toISOString(),
        groupId: Number(body.groupId),
        groupName: "Health"
    });
  })
];