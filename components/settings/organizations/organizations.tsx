"use client";

import { Button, Card, CardBody, CardFooter, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import CreateOrganization from "./createOrganization";
import EditOrganization from "./editOrganization";
import DeleteOrganization from "./deleteOrganization";

import { subtitle } from "@/components/primitives";

export interface Organization {
    id: number;
    name: string;
    created_at: string;
}

export default function Organizations() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

    // Modal State Management
    const createOrganizationModal = useDisclosure();
    const deleteOrganizationModal = useDisclosure();
    const editOrganizationModal = useDisclosure();

    // Fetch Organizations
    const fetchOrganizations = async () => {
        try {
            const response = await fetch("/api/organizations");
            const data = await response.json();
            setOrganizations(data);
        } catch (error) {
            console.error("Failed to fetch organizations:", error);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    return (
        <section className="flex flex-col items-center justify-center gap-4 w-full px-4">
            {/* Header with Responsive Layout */}
            <div className="inline-flex items-center gap-x-1">
                <h1 className={subtitle()}>동아리</h1>
                <Button isIconOnly color="primary" radius="full" size="sm" variant="light" onPress={createOrganizationModal.onOpen}>
                    <AddIcon fontSize="small" />
                </Button>
            </div>

            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-3xl">
                {organizations.map((organization) => (
                    <Card key={organization.id} className="flex w-full sm:w-[140px]" radius="sm">
                        <CardBody className="pb-1">
                            <p className="text-sm font-bold text-center">{organization.name}</p>
                        </CardBody>
                        <CardFooter className="flex justify-between p-2">
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
            </div>

            {/* Modals */}
            <CreateOrganization createOrganizationModal={createOrganizationModal} fetchOrganizations={fetchOrganizations} />
            {selectedOrganization && (
                <>
                    <EditOrganization
                        editOrganizationModal={editOrganizationModal}
                        fetchOrganizations={fetchOrganizations}
                        organization={selectedOrganization}
                    />
                    <DeleteOrganization
                        deleteOrganizationModal={deleteOrganizationModal}
                        fetchOrganizations={fetchOrganizations}
                        organization={selectedOrganization}
                    />
                </>
            )}
        </section>
    );
}
