import { Shield, Lock, Eye, FileText, Users, Database, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacidade = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Política de Privacidade
          </h1>
          <p className="text-xl text-gray-600">
            S.O.S Voz Feminina - Proteção de Dados Pessoais
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Introdução */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                <FileText className="w-6 h-6 text-blue-600" />
                Introdução
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                A <strong>S.O.S Voz Feminina</strong> está comprometida com a proteção da privacidade 
                e segurança dos dados pessoais de nossas usuárias. Esta Política de Privacidade 
                descreve como coletamos, utilizamos, armazenamos e protegemos suas informações 
                pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
              <p>
                Esta política aplica-se ao uso de nosso aplicativo móvel, site e todos os serviços 
                relacionados oferecidos pela S.O.S Voz Feminina.
              </p>
            </CardContent>
          </Card>

          {/* Dados Coletados */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                <Database className="w-6 h-6 text-green-600" />
                Dados Pessoais Coletados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Dados de Denúncia
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Descrição do relato (voluntário)</li>
                    <li>• Tipo de violência reportada</li>
                    <li>• Data e local do ocorrido</li>
                    <li>• Evidências (fotos/áudios) - opcional</li>
                    <li>• ID público gerado automaticamente</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-600" />
                    Dados Técnicos
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Endereço IP (anonimizado)</li>
                    <li>• Informações do dispositivo</li>
                    <li>• Logs de acesso (sem identificação)</li>
                    <li>• Cookies de funcionalidade</li>
                  </ul>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <p className="text-blue-800 font-medium">
                  <strong>Importante:</strong> NÃO coletamos nome, CPF, endereço residencial, 
                  telefone ou outros dados que possam identificar diretamente a usuária.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Finalidades */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                <Eye className="w-6 h-6 text-orange-600" />
                Finalidades do Tratamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-800">Finalidades Principais:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Receber e processar denúncias de violência</li>
                    <li>• Fornecer suporte e acompanhamento</li>
                    <li>• Manter histórico para análise de padrões</li>
                    <li>• Garantir funcionamento técnico do app</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-800">Base Legal (LGPD):</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Art. 7º, I:</strong> Consentimento</li>
                    <li>• <strong>Art. 7º, V:</strong> Execução de política pública</li>
                    <li>• <strong>Art. 7º, VI:</strong> Proteção da vida</li>
                    <li>• <strong>Art. 7º, X:</strong> Interesse legítimo</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compartilhamento */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                <Users className="w-6 h-6 text-red-600" />
                Compartilhamento de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                <strong>NÃO compartilhamos</strong> dados pessoais com terceiros, exceto nas seguintes situações:
              </p>
              <ul className="space-y-2 ml-4">
                <li>• <strong>Autoridades competentes:</strong> Quando exigido por lei ou ordem judicial</li>
                <li>• <strong>Emergências:</strong> Em situações de risco iminente à vida</li>
                <li>• <strong>Prestadores de serviço:</strong> Empresas que nos auxiliam tecnicamente (com contratos de proteção)</li>
              </ul>
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <p className="text-red-800 font-medium">
                  <strong>Proteção:</strong> Todos os dados são criptografados e armazenados 
                  em servidores seguros no Brasil.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                <Lock className="w-6 h-6 text-green-600" />
                Medidas de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-gray-800">Segurança Técnica:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Criptografia SSL/TLS</li>
                    <li>• Senhas criptografadas</li>
                    <li>• Servidores seguros</li>
                    <li>• Backup regular</li>
                    <li>• Monitoramento 24/7</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-gray-800">Segurança Organizacional:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Treinamento da equipe</li>
                    <li>• Controle de acesso</li>
                    <li>• Auditoria regular</li>
                    <li>• Políticas internas</li>
                    <li>• Contratos de confidencialidade</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Direitos */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                <Shield className="w-6 h-6 text-purple-600" />
                Seus Direitos (LGPD)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-gray-800">Direitos Fundamentais:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Confirmação:</strong> Saber se tratamos seus dados</li>
                    <li>• <strong>Acesso:</strong> Obter cópia dos seus dados</li>
                    <li>• <strong>Correção:</strong> Corrigir dados incompletos</li>
                    <li>• <strong>Anonimização:</strong> Tornar dados anônimos</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-gray-800">Outros Direitos:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Portabilidade:</strong> Transferir dados</li>
                    <li>• <strong>Eliminação:</strong> Excluir dados</li>
                    <li>• <strong>Informação:</strong> Saber sobre compartilhamento</li>
                    <li>• <strong>Revogação:</strong> Retirar consentimento</li>
                  </ul>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                <p className="text-purple-800">
                  <strong>Para exercer seus direitos:</strong> Entre em contato através do 
                  email <strong>privacidade@sosvozfeminina.org</strong> ou pelo formulário de contato.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Retenção */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">
                Período de Retenção dos Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <ul className="space-y-2">
                <li>• <strong>Denúncias ativas:</strong> Mantidas enquanto houver acompanhamento</li>
                <li>• <strong>Denúncias arquivadas:</strong> 5 anos após o encerramento</li>
                <li>• <strong>Logs técnicos:</strong> 1 ano</li>
                <li>• <strong>Dados de navegação:</strong> 6 meses</li>
              </ul>
              <p>
                Após esses períodos, os dados são automaticamente excluídos ou anonimizados.
              </p>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">
                Cookies e Tecnologias Similares
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Utilizamos cookies apenas para garantir o funcionamento básico do aplicativo:
              </p>
              <ul className="space-y-2 ml-4">
                <li>• <strong>Cookies essenciais:</strong> Para funcionamento do app</li>
                <li>• <strong>Cookies de sessão:</strong> Para manter login</li>
                <li>• <strong>Cookies de segurança:</strong> Para proteger contra ataques</li>
              </ul>
              <p>
                Você pode gerenciar cookies nas configurações do seu navegador.
              </p>
            </CardContent>
          </Card>

          {/* Alterações */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">
                Alterações nesta Política
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Esta Política de Privacidade pode ser atualizada periodicamente. 
                Alterações significativas serão comunicadas através do aplicativo 
                ou por email, quando aplicável.
              </p>
              <p>
                Recomendamos que você revise esta política regularmente para 
                estar ciente de como protegemos seus dados.
              </p>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                Dúvidas sobre Privacidade?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-blue-100">
                Se você tiver dúvidas sobre esta Política de Privacidade ou 
                sobre o tratamento de seus dados pessoais, entre em contato:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-white">Email:</p>
                  <p className="text-blue-100">privacidade@sosvozfeminina.org</p>
                </div>
                <div>
                  <p className="font-semibold text-white">Encarregado de Dados (DPO):</p>
                  <p className="text-blue-100">dpo@sosvozfeminina.org</p>
                </div>
              </div>
              <p className="text-sm text-blue-200 mt-4">
                Resposta em até 15 dias úteis, conforme previsto na LGPD.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>
            S.O.S Voz Feminina - Protegendo e Empoderando Mulheres
          </p>
          <p className="text-sm mt-2">
            Esta política está em conformidade com a Lei nº 13.709/2018 (LGPD)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacidade;
