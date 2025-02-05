"use client";

import React from "react";
import { Button, Modal, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

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
        <Modal isOpen={isOpen} placement="center" size="xs" isDismissable={false} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">로그인이 필요합니다!</ModalHeader>
                <ModalFooter className="justify-center gap-4">
                    <Button color="danger" variant="light" onPress={onClose}>
                        닫기
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default YouMustBeSignedIn;
