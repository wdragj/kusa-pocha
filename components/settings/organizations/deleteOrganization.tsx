"use client";

import React, { useState } from "react";
import { Button, Modal, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

import { Organization } from "./organizations";

interface DeleteOrganizationProps {
    deleteOrganizationModal: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    fetchOrganizations: () => void;
    organization: Organization;
}

const DeleteOrganization: React.FC<DeleteOrganizationProps> = ({ deleteOrganizationModal, fetchOrganizations, organization }) => {
    const { isOpen, onClose } = deleteOrganizationModal;
    const [isLoading, setIsLoading] = useState(false);

    // function to handle organization deletion
    const handleDeleteOrganization = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/organizations/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: organization.id,
                }),
            });

            if (response.ok) {
                console.log(`Organization deleted successfully with id: ${organization.id}`);
                fetchOrganizations(); // Fetch organizations again to update the list
            }
        } catch (error) {
            console.error(`Failed to delete organization:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} placement="center" size="xs" isDismissable={false} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{organization.name}를 삭제 하시겠습니까?</ModalHeader>
                <ModalFooter className="justify-center gap-4">
                    <Button color="danger" variant="flat" onPress={onClose}>
                        취소
                    </Button>
                    <Button
                        color="danger"
                        variant="shadow"
                        fullWidth
                        isLoading={isLoading}
                        isDisabled={isLoading}
                        onPress={async () => {
                            await handleDeleteOrganization();
                            onClose();
                        }}
                    >
                        {isLoading ? "삭제 중..." : "삭제"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteOrganization;
