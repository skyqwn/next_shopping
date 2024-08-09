"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { TotalOrders } from "@/lib/infer-type";

interface SalesProps {
  totalOrders: TotalOrders[];
}

const Sales = ({ totalOrders }: SalesProps) => {
  return (
    <div>
      <h2>Sales</h2>
    </div>
  );
};

export default Sales;
