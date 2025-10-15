import { FileText, Scale, Shield, AlertTriangle, Users, Globe, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Termos = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Scale className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Termos de Uso
          </h1>
          <p className="text-xl text-gray-600">
            S.O.S Voz Feminina - Condições de Utilização
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
                1. Aceitação dos Termos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Bem-vinda ao <strong>S.O.S Voz Feminina</strong>! Ao utilizar nosso aplicativo 
                móvel, site ou qualquer serviço relacionado, você concorda com estes Termos de Uso.
              </p>
              <p>
                Se você não concorda com qualquer parte destes termos, por favor, não utilize 
                nossos serviços. Estes termos constituem um acordo legal entre você e a 
                S.O.S Voz Feminina.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <p className="text-blue-800 font-medium">
                  <strong>Importante:</strong> Nossos serviços são destinados exclusivamente 
                  para mulheres que buscam apoio e orientação em situações de violência.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Descrição do Serviço */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                <Users className="w-6 h-6 text-green-600" />
                2. Descrição dos Serviços
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                O S.O.S Voz Feminina é uma plataforma digital que oferece:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-gray-800">Serviços Principais:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Canal de denúncias anônimas</li>
                    <li>• Consulta de status de denúncias</li>
                    <li>• Informações educativas sobre violência</li>
                    <li>• Contatos de emergência</li>
                    <li>• Suporte e orientação</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-gray-800">Características:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Interface amigável e segura</li>
                    <li>• Acesso 24 horas por dia</li>
                    <li>• Proteção de dados pessoais</li>
                    <li>• Suporte multidisciplinar</li>
                    <li>• Tecnologia de ponta</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Uso Adequado */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                <Shield className="w-6 h-6 text-orange-600" />
                3. Uso Adequado dos Serviços
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-800 text-green-600">✓ Permitido:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Relatar situações de violência</li>
                    <li>• Buscar orientação e apoio</li>
                    <li>• Consultar informações educativas</li>
                    <li>• Acessar contatos de emergência</li>
                    <li>• Utilizar recursos de segurança</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-800 text-red-600">✗ Proibido:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Fazer denúncias falsas ou maliciosas</li>
                    <li>• Compartilhar informações de outras usuárias</li>
                    <li>• Tentar quebrar a segurança do sistema</li>
                    <li>• Usar o serviço para fins comerciais</li>
                    <li>• Violar direitos de terceiros</li>
                  </ul>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                <p className="text-orange-800 font-medium">
                  <strong>Atenção:</strong> O uso inadequado pode resultar na suspensão 
                  ou encerramento da sua conta, além de consequências legais.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Responsabilidades */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">
                4. Responsabilidades e Limitações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-800">Responsabilidades da S.O.S Voz Feminina:</h3>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li>• Manter a confidencialidade das denúncias</li>
                  <li>• Fornecer suporte técnico adequado</li>
                  <li>• Proteger os dados pessoais das usuárias</li>
                  <li>• Manter o serviço disponível 24/7</li>
                  <li>• Processar denúncias com agilidade</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-800">Limitações de Responsabilidade:</h3>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li>• Não garantimos resolução imediata de casos</li>
                  <li>• Não somos responsáveis por ações de terceiros</li>
                  <li>• Serviço pode sofrer interrupções técnicas</li>
                  <li>• Orientação não substitui atendimento profissional</li>
                  <li>• Não garantimos resultados específicos</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <p className="text-yellow-800 font-medium">
                  <strong>Emergências:</strong> Em situações de risco iminente, 
                  contate imediatamente o 190 (Polícia) ou 180 (Central de Atendimento à Mulher).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Propriedade Intelectual */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                <Globe className="w-6 h-6 text-purple-600" />
                5. Propriedade Intelectual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Todo o conteúdo do S.O.S Voz Feminina, incluindo textos, imagens, logos, 
                software e design, é protegido por direitos autorais e outras leis de 
                propriedade intelectual.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-gray-800">Direitos Reservados:</h3>
                  <ul className="space-y-2">
                    <li>• Logotipo e identidade visual</li>
                    <li>• Conteúdo educativo</li>
                    <li>• Software e aplicativo</li>
                    <li>• Base de dados</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-gray-800">Uso Permitido:</h3>
                  <ul className="space-y-2">
                    <li>• Uso pessoal e não comercial</li>
                    <li>• Compartilhamento de informações públicas</li>
                    <li>• Citações com atribuição</li>
                    <li>• Fins educativos</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacidade */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">
                6. Privacidade e Proteção de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                A proteção da sua privacidade é fundamental para nós. O tratamento de 
                dados pessoais é regido por nossa <strong>Política de Privacidade</strong>, 
                em conformidade com a LGPD.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <p className="text-blue-800 font-medium">
                  <strong>Consulte nossa Política de Privacidade completa em:</strong><br/>
                  <a href="/privacidade" className="text-blue-600 underline hover:text-blue-800">
                    https://sos-voz-feminina.vercel.app/privacidade
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Modificações */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                7. Modificações dos Termos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
                Alterações significativas serão comunicadas através do aplicativo ou por email.
              </p>
              <p>
                O uso continuado dos serviços após as modificações constitui aceitação 
                dos novos termos. Se você não concordar com as alterações, deve 
                descontinuar o uso dos serviços.
              </p>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <p className="text-yellow-800 font-medium">
                  <strong>Recomendação:</strong> Revise estes termos periodicamente 
                  para estar ciente de eventuais alterações.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rescisão */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">
                8. Rescisão do Serviço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Você pode encerrar sua conta a qualquer momento através das configurações 
                do aplicativo ou entrando em contato conosco.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-gray-800">Rescisão pelo Usuário:</h3>
                  <ul className="space-y-2">
                    <li>• Acesso às configurações</li>
                    <li>• Solicitação de exclusão</li>
                    <li>• Processamento em até 30 dias</li>
                    <li>• Backup de dados (quando aplicável)</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-gray-800">Rescisão pela Plataforma:</h3>
                  <ul className="space-y-2">
                    <li>• Violação dos termos</li>
                    <li>• Uso inadequado</li>
                    <li>• Atividades fraudulentas</li>
                    <li>• Decisão administrativa</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lei Aplicável */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">
                9. Lei Aplicável e Foro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Estes Termos de Uso são regidos pela legislação brasileira. 
                Qualquer disputa será resolvida nos tribunais competentes do Brasil.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Legislação Aplicável:</h3>
                <ul className="space-y-1 text-gray-700">
                  <li>• Lei Geral de Proteção de Dados (LGPD)</li>
                  <li>• Marco Civil da Internet</li>
                  <li>• Lei Maria da Penha</li>
                  <li>• Código de Defesa do Consumidor</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-white">
                <Phone className="w-6 h-6" />
                10. Contato e Suporte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-purple-100">
                Para dúvidas sobre estes Termos de Uso ou qualquer questão relacionada 
                aos nossos serviços, entre em contato:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-white">Suporte Técnico:</p>
                  <p className="text-purple-100">suporte@sosvozfeminina.org</p>
                  <p className="font-semibold text-white mt-4">Dúvidas Legais:</p>
                  <p className="text-purple-100">juridico@sosvozfeminina.org</p>
                </div>
                <div>
                  <p className="font-semibold text-white">Emergências:</p>
                  <p className="text-purple-100">190 (Polícia)</p>
                  <p className="text-purple-100">180 (Central da Mulher)</p>
                  <p className="font-semibold text-white mt-4">Aplicativo:</p>
                  <p className="text-purple-100">Disponível 24/7</p>
                </div>
              </div>
              <p className="text-sm text-purple-200 mt-4">
                Resposta em até 48 horas para questões não urgentes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>
            S.O.S Voz Feminina - Empoderando Mulheres através da Tecnologia
          </p>
          <p className="text-sm mt-2">
            Estes termos estão em conformidade com a legislação brasileira vigente
          </p>
        </div>
      </div>
    </div>
  );
};

export default Termos;
