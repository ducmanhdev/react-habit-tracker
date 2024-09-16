import {createContext, ReactNode, useContext, useRef} from "react";
import ModalConfirm, {ModalConfirmRef} from "@/components/ModalConfirm.tsx";

type ModalConfirmContextType = {
    confirm: ModalConfirmRef["open"];
};

const ModalConfirmContext = createContext<ModalConfirmContextType | null>(null);

export const useModalConfirmContext = () => {
    const context = useContext(ModalConfirmContext);
    if (!context) {
        throw new Error("useModalConfirmContext must be used within a ModalConfirmProvider");
    }
    return context;
};

type ModalConfirmProviderProps = {
    children: ReactNode;
};

export const ModalConfirmProvider = ({children}: ModalConfirmProviderProps) => {
    const modalConfirmRef = useRef<ModalConfirmRef>(null);
    const value: ModalConfirmContextType = {
        confirm: (onConfirm) => {
            modalConfirmRef.current?.open(onConfirm);
        }
    }
    return (
        <ModalConfirmContext.Provider value={value}>
            {children}
            <ModalConfirm ref={modalConfirmRef}/>
        </ModalConfirmContext.Provider>
    );
};
