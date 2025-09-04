import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName: string;
  isLoading?: boolean;
}

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  itemName,
  isLoading = false 
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm shadow-strong border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="text-white" size={24} />
          </div>
          <CardTitle className="text-xl text-red-600">{title}</CardTitle>
          <CardDescription className="text-sm">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 pb-6 space-y-4">
          {/* Item a ser excluído */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-center">
              <span className="text-sm font-medium text-red-800">
                {itemName}
              </span>
            </div>
          </div>

          {/* Aviso */}
          <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" size={16} />
            <div className="text-xs text-yellow-800">
              Esta ação não pode ser desfeita. O item será permanentemente removido.
            </div>
          </div>

          {/* Botões */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="flex-1 flex items-center space-x-2"
              disabled={isLoading}
            >
              <Trash2 size={16} />
              <span>{isLoading ? 'Excluindo...' : 'Excluir'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteConfirmModal;
