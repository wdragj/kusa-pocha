import React from "react";
import { Card, CardBody, CardFooter, CardHeader, Divider, Image, Button } from "@heroui/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

interface Item {
    created_at: string;
    id: number;
    img: string;
    name: string;
    organization: string;
    price: number;
    type: string;
}

interface ItemCardProps {
    item: Item;
    setSelectedItem: React.Dispatch<React.SetStateAction<Item | null>>;
    session: { role?: string } | null;
    onEdit: () => void;
    onDelete: () => void;
    onBuyNow: () => void;
    onAddToCart: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, setSelectedItem, session, onEdit, onDelete, onBuyNow, onAddToCart }) => {
    return (
        <Card className="col-span-2 sm:col-span-2 h-[250px]">
            <CardHeader className="py-2 px-4 flex justify-between">
                <h4 className="font-bold text-lg">{item.name}</h4>
                {session?.role === "admin" && (
                    <div className="flex gap-2">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="warning"
                            onPress={() => {
                                setSelectedItem(item);
                                onEdit();
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </Button>
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => {
                                setSelectedItem(item);
                                onDelete();
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </Button>
                    </div>
                )}
            </CardHeader>
            <Divider />
            <CardBody className="p-0 overflow-hidden">
                <div className="relative w-full" style={{ height: "200px" }}>
                    <Image alt="Item Image" src={item.img} className="inset-0 w-full h-full object-cover object-center rounded-none" />
                </div>
            </CardBody>
            <Divider />
            <CardFooter className="px-4 flex justify-between">
                <h4 className="font-bold text-lg">${item.price}</h4>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        color="success"
                        variant="flat"
                        onPress={() => {
                            setSelectedItem(item);
                            onBuyNow();
                        }}
                    >
                        <p className="font-semibold">Buy Now</p>
                    </Button>
                    <Button
                        size="sm"
                        color="warning"
                        variant="flat"
                        onPress={() => {
                            setSelectedItem(item);
                            onAddToCart();
                        }}
                    >
                        <ShoppingCartIcon fontSize="small" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default ItemCard;
