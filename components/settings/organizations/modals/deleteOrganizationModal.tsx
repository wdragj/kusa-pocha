"use client";

import React, { useState } from "react";
import { Alert, Button, Modal, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

import { Organization } from "../organizations";

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
    const [alert, setAlert] = useState<{ type: "success" | "danger" | "warning"; title: string; message: string } | null>(null);

    // function to handle organization deletion
    const handleDeleteOrganization = async () => {
        setIsLoading(true);
        setAlert(null); // Reset alert before making request

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

            if (!response.ok) {
                throw new Error(`Failed to delete organization: ${response.statusText}`);
            }

            setAlert({ type: "success", title: "Success", message: `Organization deleted successfully with name: ${organization.name}` });

            const data = await response.json();
            fetchOrganizations(); // Fetch organizations again to update the list
        } catch (error) {
            setAlert({ type: "danger", title: "Error", message: `Failed to delete organization: ${organization.name}` });
        } finally {
            setIsLoading(false);
            setTimeout(() => setAlert(null), 4000); // Hide alert after 4 seconds
        }
    };

    return (
        <>
            {/* Alert Notification - Positioned at the Bottom */}
            {alert && (
                <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
                    <Alert color={alert.type} variant="solid" title={alert.title} description={alert.message} onClose={() => setAlert(null)} />
                </div>
            )}

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
        </>
    );
};

export default DeleteOrganization;
