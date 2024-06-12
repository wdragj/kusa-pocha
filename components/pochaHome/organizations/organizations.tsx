"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import EditOrganization from "./editOrganization";
import DeleteOrganization from "./deleteOrganization";
import CreateOrganization from "./createOrganization";

import { subtitle } from "@/components/primitives";

export interface Organization {
  id: number;
  name: string;
  created_at: string;
}

export default function Organizations() {
  // Organizations state
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

  // Modals for items
  const createOrganizationModal = useDisclosure(); // Create organization modal
  const deleteOrganizationModal = useDisclosure(); // Delete organization modal
  const editOrganizationModal = useDisclosure(); // Edit organization modal

  // Fetch organizations from the server
  const fetchOrganizations = async () => {
    try {
      const response = await fetch("/api/organizations");
      const data = await response.json();

      console.log(data);

      setOrganizations(data);
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []); // Empty array ensures it runs only on mount

  return (
    <section className="flex flex-col items-center justify-center gap-2">
      <div className="flex flex-row items-center justify-center gap-1">
        <h1 className={subtitle()}>Organizations</h1>
        <Button
          isIconOnly
          color="primary"
          radius="full"
          size="sm"
          variant="light"
          onPress={() => {
            createOrganizationModal.onOpen();
          }}
        >
          <AddIcon fontSize="small" />
        </Button>
      </div>
      <div className="flex flex-row items-center justify-center gap-4">
        {organizations.map((organization) => (
          <Card key={organization.id} className="flex w-[130px]" radius="sm">
            <CardBody className="pb-1">
              <p className="text-sm font-bold text-center">
                {organization.name}
              </p>
            </CardBody>
            <CardFooter className="flex flex-row justify-around pt-0">
              <Button
                isIconOnly
                color="warning"
                radius="full"
                size="sm"
                variant="light"
                onPress={() => {
                  setSelectedOrganization(organization);
                  editOrganizationModal.onOpen();
                }}
              >
                <EditIcon fontSize="small" />
              </Button>
              <Button
                isIconOnly
                color="danger"
                radius="full"
                size="sm"
                variant="light"
                onPress={() => {
                  setSelectedOrganization(organization);
                  deleteOrganizationModal.onOpen();
                }}
              >
                <DeleteIcon fontSize="small" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        {selectedOrganization && (
          <>
            <EditOrganization
              editOrganizationModal={editOrganizationModal}
              fetchOrganizations={fetchOrganizations}
              organization={selectedOrganization!} // Non-null assertion since it will be set before modal opens
            />
            <DeleteOrganization
              deleteOrganizationModal={deleteOrganizationModal}
              fetchOrganizations={fetchOrganizations}
              organization={selectedOrganization}
            />
          </>
        )}
      </div>
      <CreateOrganization
        createOrganizationModal={createOrganizationModal}
        fetchOrganizations={fetchOrganizations}
      />
    </section>
  );
}
