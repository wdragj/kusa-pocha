"use client";

import React from "react";
import { Button, Modal, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

interface YouMustBeSignedInProps {
    youMustBeSignedInModal: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
}

const YouMustBeSignedIn: React.FC<YouMustBeSignedInProps> = ({ youMustBeSignedInModal }) => {
    const { isOpen, onClose } = youMustBeSignedInModal;

    return (
        <Modal isOpen={isOpen} placement="center" size="xs" onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">You must be signed in!</ModalHeader>
                <ModalFooter className="justify-center gap-4">
                    <Button color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default YouMustBeSignedIn;
