import Toast from 'react-bootstrap/Toast';
import { ToastContainer } from 'react-bootstrap';

export default function CustomToast({header, message, showA, toggleShowA, bg = "primary"}) {
    return (
        <div className="py-2">
            <ToastContainer className="p-3" position={"top-end"} style={{ zIndex: 1 }} >
                <Toast bg={bg} show={showA} onClose={toggleShowA}>
                    <Toast.Header>
                        <strong className="me-auto">{header}</strong>
                    </Toast.Header>
                    <Toast.Body>
                        <strong className="me-auto" style={{ color: bg === "Light" ? "black" : "white" }}>{message}</strong>
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </div>    
    )
}