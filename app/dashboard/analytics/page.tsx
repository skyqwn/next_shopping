import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/server";
import { auth } from "@/server/auth";
import { orderProduct } from "@/server/schema";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import Sales from "./slaes";

const Analtics = async () => {
  const session = await auth();
  if (session?.user.role !== "admin") return redirect("/dashboard/settings");

  const totalOrders = await db.query.orderProduct.findMany({
    orderBy: [desc(orderProduct.id)],
    with: {
      order: true,
      product: true,
      productVariants: { with: { variantImages: true } },
    },
  });

  if (totalOrders.length === 0)
    return (
      <Card>
        <CardHeader>
          <CardTitle>주문내역이 없습니다.</CardTitle>
        </CardHeader>
      </Card>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Analytics</CardTitle>
        <CardDescription>
          Check your sales, new customers and more
        </CardDescription>
        <CardContent>
          <Sales totalOrders={totalOrders} />
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default Analtics;
