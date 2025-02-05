"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

interface CreateOrganizationProps {
    createOrganizationModal: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    fetchOrganizations: () => void;
}

const CreateOrganization: React.FC<CreateOrganizationProps> = ({ createOrganizationModal, fetchOrganizations }) => {
    const { isOpen, onClose } = createOrganizationModal;
    const [newOrganizationName, setNewOrganizationName] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setNewOrganizationName(newOrganizationName);
        }
    }, [isOpen]);

    const isNewOrganizationNameInvalid = useMemo(() => newOrganizationName === "", [newOrganizationName]);

    // Function to reset input values
    const resetInputValues = () => {
        setNewOrganizationName("");
    };

    // function to handle organization creation
    const handleCreateOrganization = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/organizations/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newOrganizationName,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                console.log(`Organization created successfully with id: ${data.id} and name: ${data.name}`);
                fetchOrganizations(); // Fetch organizations again to update the list
            }
        } catch (error) {
            console.error(`Failed to create organization:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            placement="center"
            size="xs"
            isDismissable={false}
            onOpenChange={(open) => {
                if (!open) resetInputValues(); // Reset input when modal closes
                onClose();
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col">동아리 생성: {newOrganizationName}</ModalHeader>

                <ModalBody>
                    <Input
                        autoFocus
                        isClearable
                        isRequired
                        color={isNewOrganizationNameInvalid ? "danger" : "success"}
                        description={`동아리 이름`}
                        errorMessage={`동아리 이름을 입력해 주세요`}
                        isInvalid={isNewOrganizationNameInvalid}
                        label="이름"
                        placeholder="동아리 이름"
                        type="text"
                        value={newOrganizationName}
                        variant="bordered"
                        onValueChange={setNewOrganizationName}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                        취소
                    </Button>
                    <Button
                        color="primary"
                        fullWidth
                        isLoading={isLoading}
                        isDisabled={isNewOrganizationNameInvalid || isLoading}
                        variant="shadow"
                        onPress={async () => {
                            await handleCreateOrganization();
                            onClose();
                        }}
                    >
                        {isLoading ? "생성 중..." : "생성"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateOrganization;
