import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ButtonColor, ButtonSurface, InputForm } from ".";

const CustomModal = ({ isOpen, toggleEvent, title, firstEvent, secondEvent }) => {
	const [modal, setModal] = useState(false);

	return (
		<div>
			<Modal isOpen={isOpen} toggle={toggleEvent}>
				<ModalHeader toggle={toggleEvent}>{title}</ModalHeader>
				<ModalBody>
					<InputForm placeholder="category" onChange={firstEvent} />
				</ModalBody>
				<ModalFooter>
					<div onClick={toggleEvent}>
						<ButtonSurface text="Add" onClick={secondEvent} />
					</div>
					<div onClick={toggleEvent}>
						<ButtonColor text="Cancel" color="danger" />
					</div>
				</ModalFooter>
			</Modal>
		</div>
	);
};

export default CustomModal;
