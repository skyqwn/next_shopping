import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";

const Orders = () => {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>주문목록</CardTitle>
        <CardDescription>주문한 목록들의 상태를 확인해보세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>최근 주문 목록들</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>주문번호</TableHead>
              <TableHead>총합</TableHead>
              <TableHead>진행상황</TableHead>
              <TableHead>주문시간</TableHead>
              <TableHead>더보기</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell>
                <Dialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"ghost"}>
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <DialogTrigger>
                          <Button className="w-full" variant={"ghost"}>
                            상세보기
                          </Button>
                        </DialogTrigger>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Dialog>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};

export default Orders;
