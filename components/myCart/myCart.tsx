"use client";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, RadioGroup, Radio, Input, Select, SelectItem } from "@heroui/react";
import { useEffect, useState, useMemo } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSession } from "@/context/sessionContext";

interface CartItem {
    itemId: string;
    itemName: string;
    quantity: number;
    price: number;
    type: string;
    organization: string;
    totalPrice: number;
}

interface TableOption {
    id: number;
    number: number;
}

interface MyCartProps {
    cartItems: CartItem[];
    refreshCart: () => void;
    setGlobalAlert: (alert: { type: "success" | "danger"; title: string; message: string } | null) => void;
}

export default function MyCart({ cartItems, refreshCart, setGlobalAlert }: MyCartProps) {
    const { session } = useSession();
    const [grandTotal, setGrandTotal] = useState(0);
    const [tables, setTables] = useState<TableOption[]>([]);

    // New states for payment info
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [paymentId, setPaymentId] = useState<string>("");
    const [tableNumber, setTableNumber] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    // Validations
    const isPaymentMethodInvalid = useMemo(() => paymentMethod === "", [paymentMethod]);
    const isPaymentIdInvalid = useMemo(() => paymentId.trim() === "", [paymentId]);
    const isTableNumberInvalid = useMemo(() => tableNumber === 0, [tableNumber]);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await fetch("/api/tables");
                if (!response.ok) throw new Error("Failed to fetch tables");
                const result = await response.json();
                setTables(result);
            } catch (error) {
                console.error("Error fetching tables:", error);
            }
        };
        fetchTables();
    }, []);

    useEffect(() => {
        setGrandTotal(cartItems.reduce((sum, item) => sum + item.totalPrice, 0));
    }, [cartItems]);

    // Update the cart in localStorage and refresh the parent state.
    const updateEntireCart = (updatedCart: CartItem[]) => {
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        refreshCart();
    };

    const removeItem = (itemId: string) => {
        const updatedItems = cartItems.filter((item) => item.itemId !== itemId);
        updateEntireCart(updatedItems);
    };

    const incrementQuantity = (itemId: string) => {
        const updatedItems = cartItems.map((item) => {
            if (item.itemId === itemId && item.quantity < 30) {
                return {
                    ...item,
                    quantity: item.quantity + 1,
                    totalPrice: (item.quantity + 1) * item.price,
                };
            }
            return item;
        });
        updateEntireCart(updatedItems);
    };

    const decrementQuantity = (itemId: string) => {
        const updatedItems = cartItems.map((item) =>
            item.itemId === itemId && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1, totalPrice: (item.quantity - 1) * item.price }
                : item
        );
        updateEntireCart(updatedItems);
    };

    const handlePurchase = async () => {
        if (!session?.id) return;
        if (isPaymentMethodInvalid || isPaymentIdInvalid || isTableNumberInvalid) return;

        setIsLoading(true);

        const order = cartItems.map((item) => ({
            itemId: item.itemId,
            itemName: item.itemName,
            quantity: item.quantity,
            price: item.price,
            type: item.type,
            organization: item.organization,
            totalPrice: item.totalPrice.toFixed(2),
        }));

        try {
            const response = await fetch(`/api/orders/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userLoginName: session.name,
                    userId: session.id,
                    userEmail: session.email,
                    userImage: session.image,
                    tableNumber,
                    paymentId,
                    paymentMethod,
                    order,
                    status: "pending",
                    totalPrice: grandTotal.toFixed(2),
                }),
            });

            if (!response.ok) throw new Error("Failed to place order");

            // console.log("Order placed successfully");
            updateEntireCart([]); // Clear local cart

            setGlobalAlert({
                type: "success",
                title: "Purchase Successful",
                message: "Your purchase was successful!",
            });
            setTimeout(() => setGlobalAlert(null), 4000);

            // Optionally reset payment info after purchase
            setPaymentMethod("");
            setPaymentId("");
            setTableNumber(0);
        } catch (error) {
            console.error("Error placing order:", error);
            setGlobalAlert({
                type: "danger",
                title: "Purchase Failed",
                message: "An error occurred while processing your purchase.",
            });
            setTimeout(() => setGlobalAlert(null), 4000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            {/* Cart Table */}
            <div className="w-full max-w-md md:max-w-lg lg:max-w-xl rounded-lg overflow-x-auto border rounded-lg">
                <Table aria-label="Cart Table" className="min-w-full" shadow="none">
                    <TableHeader>
                        <TableColumn className="text-center">ITEM</TableColumn>
                        <TableColumn className="text-center">QUANTITY</TableColumn>
                        <TableColumn className="text-center">PRICE</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {cartItems.map((item) => (
                            <TableRow key={item.itemId}>
                                <TableCell>
                                    <div className="text-center">{item.itemName}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-row gap-2 items-center justify-center">
                                        <Button
                                            isIconOnly
                                            color="danger"
                                            radius="full"
                                            size="sm"
                                            variant="light"
                                            onPress={() => (item.quantity > 1 ? decrementQuantity(item.itemId) : removeItem(item.itemId))}
                                        >
                                            {item.quantity > 1 ? <RemoveIcon fontSize="small" /> : <DeleteIcon fontSize="small" />}
                                        </Button>
                                        <span className="w-2 text-center text-sm font-semibold">{item.quantity}</span>
                                        <Button
                                            isIconOnly
                                            color="success"
                                            radius="full"
                                            size="sm"
                                            variant="light"
                                            isDisabled={item.quantity >= 30}
                                            onPress={() => {
                                                if (item.quantity < 30) {
                                                    incrementQuantity(item.itemId);
                                                }
                                            }}
                                        >
                                            <AddIcon fontSize="small" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">${item.totalPrice.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Payment Information Section */}
            <div className="w-full max-w-md md:max-w-lg lg:max-w-xl rounded-lg p-3 overflow-x-auto mt-6 p-4 border rounded-lg">
                <h2 className="text-lg font-bold mb-2">결제 정보 입력</h2>

                {/* Payment Method Selection */}
                <RadioGroup
                    // label="결제 수단"
                    orientation="horizontal"
                    value={paymentMethod}
                    onValueChange={(val: string) => {
                        setPaymentMethod(val);
                        setPaymentId(""); // Reset payment ID when changing payment method
                    }}
                    isRequired
                >
                    <Radio value="venmo">Venmo</Radio>
                    <Radio value="zelle">Zelle</Radio>
                </RadioGroup>

                {/* Payment ID Input */}
                <Input
                    autoFocus
                    isClearable
                    isRequired
                    color={isPaymentIdInvalid ? "danger" : "success"}
                    className="mt-2"
                    isInvalid={isPaymentIdInvalid}
                    label={paymentMethod === "venmo" ? "Venmo ID" : paymentMethod === "zelle" ? "Zelle Email or Number" : "결제 정보"}
                    placeholder={
                        paymentMethod === "venmo" ? "@yourVenmo" : paymentMethod === "zelle" ? "your.zelle" : "결제 수단을 선택하세요"
                    }
                    type="text"
                    variant="bordered"
                    value={paymentId}
                    fullWidth
                    onValueChange={setPaymentId}
                    disabled={paymentMethod === "" || isLoading}
                />

                {/* Table Number Selection */}
                <Select
                    isRequired
                    className="mt-2"
                    isInvalid={isTableNumberInvalid}
                    label="테이블 번호"
                    placeholder="테이블 번호를 고르세요"
                    fullWidth
                    selectedKeys={tableNumber ? [tableNumber.toString()] : []}
                    onChange={(e) => {
                        const selectedValue = e.target.value;
                        setTableNumber(selectedValue ? parseInt(selectedValue) : 0);
                    }}
                >
                    {tables.map((table) => (
                        <SelectItem key={table.id} value={table.number.toString()} textValue={table.number.toString()}>
                            Table {table.number}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            {/* Purchase Button */}
            <div className="flex justify-center mt-4 w-full max-w-xs">
                <Button
                    className="w-full max-w-xs"
                    color="primary"
                    variant="shadow"
                    onPress={handlePurchase}
                    isDisabled={isLoading || isPaymentMethodInvalid || isPaymentIdInvalid || isTableNumberInvalid}
                    isLoading={isLoading}
                >
                    {isLoading ? "결제 중..." : `결제하기 ($${grandTotal.toFixed(2)})`}
                </Button>
            </div>
        </div>
    );
}
