import { FunctionComponent, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './Confirmation.module.css';

type Props = {
    children: JSX.Element | JSX.Element[];
    title?: string;
    onAccept: () => void;
    onCancel: () => void;
    show: boolean;    
  };
//   <Modal
//         show={show}
//         onHide={handleClose}
//         backdrop="static"
//         keyboard={false}
//       ></Modal>

const Confirmation: FunctionComponent<Props> = ({ children, title, onAccept, onCancel, show, }) => {
    return <>
        <Modal show={show}  backdrop="static" onHide={onCancel}>
        <Modal.Header closeButton >
            <Modal.Title>{title || 'Confirmation'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            {children}
        </Modal.Body>

        <Modal.Footer>
            
            <Button variant="primary" onClick={onAccept}>Accept</Button>
            <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        </Modal.Footer>
    </Modal>
    </>

};
export default Confirmation;