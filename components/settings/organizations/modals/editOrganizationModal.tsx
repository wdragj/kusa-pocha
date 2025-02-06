"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

import { Organization } from "../organizations";

interface EditOrganizationProps {
    editOrganizationModal: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    fetchOrganizations: () => void;
    organization: Organization;
}

const EditOrganization: React.FC<EditOrganizationProps> = ({ editOrganizationModal, fetchOrganizations, organization }) => {
    const { isOpen, onClose } = editOrganizationModal;
    const [editedOrganizationName, setEditedOrganizationName] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "danger" | "warning"; title: string; message: string } | null>(null);

    useEffect(() => {
        if (isOpen && organization) {
            setEditedOrganizationName(organization.name);
        }
    }, [isOpen, organization]);

    const isEditedOrganizationNameInvalid = useMemo(() => editedOrganizationName === "", [editedOrganizationName]);

    const hasChanges = useMemo(() => editedOrganizationName !== organization.name, [editedOrganizationName, organization]);

    // function to handle organization edit
    const handleEditOrganization = async () => {
        if (!hasChanges) {
            setAlert({ type: "warning", title: "No Changes Detected", message: "You didn't change any fields." });
            setTimeout(() => setAlert(null), 4000);
            onClose();
            return;
        }

        setIsLoading(true);
        setAlert(null); // Reset alert before making request

        try {
            const response = await fetch(`/api/organizations/edit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: organization.id, name: editedOrganizationName }),
            });

            if (!response.ok) throw new Error("Failed to edit organization");

            setAlert({ type: "success", title: "Success", message: `Organization "${editedOrganizationName}" has been edited successfully.` });

            fetchOrganizations();
            onClose();
        } catch (error) {
            setAlert({ type: "danger", title: "Error", message: `Failed to edit organization: ${editedOrganizationName}` });
        } finally {
            setIsLoading(false);
            setTimeout(() => setAlert(null), 4000);
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
                    <ModalHeader className="flex flex-col gap-1">동아리 수정: {organization.name}</ModalHeader>

                    <ModalBody>
                        <Input
                            autoFocus
                            isClearable
                            isRequired
                            color={isEditedOrganizationNameInvalid ? "danger" : "success"}
                            description={`동아리 이름`}
                            errorMessage={`동아리 이름을 입력해 주세요`}
                            isInvalid={isEditedOrganizationNameInvalid}
                            label="이름"
                            placeholder="동아리 이름"
                            type="text"
                            value={editedOrganizationName}
                            variant="bordered"
                            onValueChange={setEditedOrganizationName}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                            취소
                        </Button>
                        <Button
                            color="primary"
                            isLoading={isLoading}
                            isDisabled={isEditedOrganizationNameInvalid || isLoading}
                            variant="shadow"
                            fullWidth
                            onPress={async () => {
                                await handleEditOrganization();
                                onClose();
                            }}
                        >
                            {isLoading ? "저장 중..." : "저장"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default EditOrganization;
