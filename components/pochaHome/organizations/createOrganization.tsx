/* eslint-disable jsx-a11y/no-autofocus */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

interface CreateOrganizationProps {
  createOrganizationModal: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  fetchOrganizations: () => void;
}

const CreateOrganization: React.FC<CreateOrganizationProps> = ({
  createOrganizationModal,
  fetchOrganizations,
}) => {
  const { isOpen, onClose } = createOrganizationModal;
  const [newOrganizationName, setNewOrganizationName] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setNewOrganizationName(newOrganizationName);
    }
  }, [isOpen]);

  const isNewOrganizationNameInvalid = useMemo(
    () => newOrganizationName === "",
    [newOrganizationName],
  );

  // Function to reset input values
  const resetInputValues = () => {
    setNewOrganizationName("");
  };

  // function to handle organization creation
  const handleCreateOrganization = async () => {
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

        console.log(
          `Organization created successfully with id: ${data.id} and name: ${data.name}`,
        );
        fetchOrganizations(); // Fetch organizations again to update the list
      }
    } catch (error) {
      console.error(`Failed to create organization:`, error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      size="xs"
      onOpenChange={(open) => {
        if (!open) resetInputValues();
        onClose();
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col">
          Create Organization: {newOrganizationName}
        </ModalHeader>

        <ModalBody>
          <Input
            autoFocus
            isClearable
            isRequired
            color={isNewOrganizationNameInvalid ? "danger" : "success"}
            description={`Name of organization`}
            errorMessage={`Please enter an organization name`}
            isInvalid={isNewOrganizationNameInvalid}
            label="Name"
            placeholder="Organization Name"
            type="text"
            value={newOrganizationName}
            variant="bordered"
            onValueChange={setNewOrganizationName}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            color="primary"
            isDisabled={isNewOrganizationNameInvalid}
            variant="shadow"
            onPress={async () => {
              await handleCreateOrganization();
              onClose();
            }}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateOrganization;
