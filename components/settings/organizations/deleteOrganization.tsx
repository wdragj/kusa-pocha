"use client";

import React from "react";
import { Button, Modal, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

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

    // function to handle organization deletion
    const handleDeleteOrganization = async () => {
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
        }
    };

    return (
        <Modal isOpen={isOpen} placement="center" size="xs" onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Delete {organization.name}?</ModalHeader>
                <ModalFooter className="justify-center gap-4">
                    <Button color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                    <Button
                        color="danger"
                        variant="shadow"
                        onPress={async () => {
                            await handleDeleteOrganization();
                            onClose();
                        }}
                    >
                        Delete
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteOrganization;
