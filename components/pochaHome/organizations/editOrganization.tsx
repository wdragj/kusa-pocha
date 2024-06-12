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

const EditOrganization: React.FC<EditOrganizationProps> = ({
  editOrganizationModal,
  fetchOrganizations,
  organization,
}) => {
  const { isOpen, onClose } = editOrganizationModal;
  const [editedOrganizationName, setEditedOrganizationName] =
    useState<string>("");

  useEffect(() => {
    if (isOpen && organization) {
      setEditedOrganizationName(organization.name);
    }
  }, [isOpen, organization]);

  const iseditedOrganizationNameInvalid = useMemo(
    () => editedOrganizationName === "",
    [editedOrganizationName],
  );

  // function to handle organization edit
  const handleEditOrganization = async () => {
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

        console.log(
          `Organization edited successfully with id: ${data.id} and name: ${data.name}`,
        );
        fetchOrganizations(); // Fetch organizations again to update the list
      }
    } catch (error) {
      console.error(`Failed to edit organization:`, error);
    }
  };

  return (
    <Modal isOpen={isOpen} placement="center" size="xs" onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Edit Organization: {editedOrganizationName}
        </ModalHeader>

        <ModalBody>
          <Input
            autoFocus
            isClearable
            isRequired
            color={iseditedOrganizationNameInvalid ? "danger" : "success"}
            description={`Name of organization`}
            errorMessage={`Please enter an organization name`}
            isInvalid={iseditedOrganizationNameInvalid}
            label="Name"
            placeholder="Organization Name"
            type="text"
            value={editedOrganizationName}
            variant="bordered"
            onValueChange={setEditedOrganizationName}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            color="primary"
            isDisabled={iseditedOrganizationNameInvalid}
            variant="shadow"
            onPress={async () => {
              await handleEditOrganization();
              onClose();
            }}
          >
            Change
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditOrganization;
