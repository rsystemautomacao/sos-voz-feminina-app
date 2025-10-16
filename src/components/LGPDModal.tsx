import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Shield, CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface LGPDModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export const LGPDModal: React.FC<LGPDModalProps> = ({ isOpen, onAccept }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white" size={32} />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Proteção de Dados e Privacidade
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 mt-2">
            S.O.S Voz Feminina - Lei Geral de Proteção de Dados (LGPD)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Resumo Principal */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <CheckCircle className="text-blue-600" size={24} />
              <h3 className="font-semibold text-blue-800 text-lg">Seus dados estão seguros</h3>
            </div>
            <p className="text-blue-700 text-base mb-4">
              O S.O.S Voz Feminina foi desenvolvido com foco total na proteção da sua privacidade e segurança.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-600" size={16} />
                <span>Relatos anônimos</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-600" size={16} />
                <span>Dados criptografados</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-600" size={16} />
                <span>Acesso restrito</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-600" size={16} />
                <span>Conformidade LGPD</span>
              </div>
            </div>
          </div>

          {/* Botão Ver Mais */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setShowFullContent(!showFullContent)}
              className="flex items-center space-x-2 mx-auto"
            >
              {showFullContent ? (
                <>
                  <ChevronUp size={16} />
                  <span>Ver Menos</span>
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  <span>Ver Mais Detalhes</span>
                </>
              )}
            </Button>
          </div>

          {/* Conteúdo Expandido */}
          {showFullContent && (
            <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
              {/* Coleta de Dados */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <Shield className="text-purple-600" size={18} />
                  <span>Coleta e Uso de Dados</span>
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="text-green-600 mt-1" size={16} />
                    <span><strong>Relatos anônimos:</strong> Não coletamos informações pessoais identificáveis</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="text-green-600 mt-1" size={16} />
                    <span><strong>Localização opcional:</strong> Apenas se você escolher informar</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="text-green-600 mt-1" size={16} />
                    <span><strong>Evidências:</strong> Fotos e áudios são armazenados de forma segura</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="text-green-600 mt-1" size={16} />
                    <span><strong>Finalidade:</strong> Apenas para análise e acompanhamento dos relatos</span>
                  </li>
                </ul>
              </div>

              {/* Segurança */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <Shield className="text-blue-600" size={18} />
                  <span>Medidas de Segurança</span>
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="text-green-600 mt-1" size={16} />
                    <span><strong>Criptografia:</strong> Todos os dados são criptografados</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="text-green-600 mt-1" size={16} />
                    <span><strong>Acesso restrito:</strong> Apenas administradores autorizados</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="text-green-600 mt-1" size={16} />
                    <span><strong>Backup seguro:</strong> Dados armazenados em servidores seguros</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="text-green-600 mt-1" size={16} />
                    <span><strong>Auditoria:</strong> Todas as ações são registradas</span>
                  </li>
                </ul>
              </div>

              {/* Seus Direitos */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <AlertTriangle className="text-orange-600" size={18} />
                  <span>Seus Direitos</span>
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="text-green-600 mt-1" size={16} />
                    <span><strong>Acesso:</strong> Solicitar informações sobre seus dados</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="text-green-600 mt-1" size={16} />
                    <span><strong>Correção:</strong> Corrigir dados incorretos</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="text-green-600 mt-1" size={16} />
                    <span><strong>Exclusão:</strong> Solicitar remoção de dados</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="text-green-600 mt-1" size={16} />
                    <span><strong>Portabilidade:</strong> Transferir dados para outro serviço</span>
                  </li>
                </ul>
              </div>

              {/* Contato */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Dúvidas sobre Privacidade?</h3>
                <p className="text-sm text-gray-600">
                  Entre em contato conosco através do email: <strong>sosvozfeminina@administrador.com</strong>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={onAccept}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-base font-semibold rounded-xl shadow-lg transition-all duration-300"
          >
            <CheckCircle className="mr-2" size={20} />
            Entendi e Aceito
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Ao continuar, você concorda com o uso dos seus dados conforme descrito acima.
        </p>
      </DialogContent>
    </Dialog>
  );
};
