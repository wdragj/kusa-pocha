"use client";

import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableColumn,
  TableCell,
  Chip,
  User,
} from "@nextui-org/react";
import { useCallback } from "react";

import { columns, users } from "./data";

interface UserType {
  name: string;
  email: string;
  avatar: string;
  itemName: string;
  itemOrganization: string;
  itemPrice: number;
  status: keyof typeof statusColorMap;
}

const statusColorMap: Record<string, "success" | "danger" | "warning"> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

export default function Orders() {
  const renderCell = useCallback((user: UserType, columnKey: string) => {
    const cellValue = user[columnKey as keyof UserType];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={cellValue as string}
          >
            {user.email}
          </User>
        );
      case "item":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{user.itemName}</p>
            <p className="text-bold text-sm capitalize text-default-400">
              {user.itemOrganization}
            </p>
          </div>
        );
      case "price":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">${user.itemPrice}</p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      default:
        return <span>{cellValue}</span>;
    }
  }, []);

  return (
    <Table aria-label="Orders table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            // align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={users}>
        {(user: UserType) => (
          <TableRow key={user.name}>
            {(columnKey) => (
              <TableCell
                className={
                  //   columnKey === "status" || columnKey === "actions"
                  columnKey === "actions" ? "text-center" : "text-left"
                }
              >
                {renderCell(user, columnKey as string)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
