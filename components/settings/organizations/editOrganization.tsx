"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

import { Organization } from "./organizations";

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

    useEffect(() => {
        if (isOpen && organization) {
            setEditedOrganizationName(organization.name);
        }
    }, [isOpen, organization]);

    const iseditedOrganizationNameInvalid = useMemo(() => editedOrganizationName === "", [editedOrganizationName]);

    // function to handle organization edit
    const handleEditOrganization = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/organizations/edit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: organization.id,
                    name: editedOrganizationName,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                console.log(`Organization edited successfully with id: ${data.id} and name: ${data.name}`);
                fetchOrganizations(); // Fetch organizations again to update the list
            }
        } catch (error) {
            console.error(`Failed to edit organization:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} placement="center" size="xs" isDismissable={false} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">동아리 수정: {organization.name}</ModalHeader>

                <ModalBody>
                    <Input
                        autoFocus
                        isClearable
                        isRequired
                        color={iseditedOrganizationNameInvalid ? "danger" : "success"}
                        description={`동아리 이름`}
                        errorMessage={`동아리 이름을 입력해 주세요`}
                        isInvalid={iseditedOrganizationNameInvalid}
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
                        isDisabled={iseditedOrganizationNameInvalid || isLoading}
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
    );
};

export default EditOrganization;
