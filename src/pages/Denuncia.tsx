import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Camera, Mic, Send, Shield, X, Play, Pause, Upload, FileAudio, FileImage, Calendar, MapPin, FileText, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { denunciaService, DenunciaInput } from "@/services/denunciaService";
import Navigation from "@/components/Navigation";
import DenunciaConfirmModal from "@/components/DenunciaConfirmModal";

interface MediaFile {
  
  id: string;
  file: File;
  type: 'image' | 'audio';
  url: string;
  name: string;
}

const Denuncia = () => {
  const navigate = useNavigate();
  const [denunciaData, setDenunciaData] = useState<DenunciaInput>({
    relato: "",
    tipoViolencia: "",
    dataOcorrido: "",
    localizacao: {},
    evidencias: []
  });
  const [dataDisplay, setDataDisplay] = useState<string>(""); // Para mostrar data formatada
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [denunciaConfirmada, setDenunciaConfirmada] = useState<{id: string, tipo: string} | null>(null);
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Função para gerar ID único
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Função para capturar foto da câmera
  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // Função para selecionar arquivos da galeria
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Função para processar arquivos selecionados
  const processFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      const isImage = file.type.startsWith('image/');
      const isAudio = file.type.startsWith('audio/');
      
      if (isImage || isAudio) {
        const id = generateId();
        const url = URL.createObjectURL(file);
        
        const mediaFile: MediaFile = {
          id,
          file,
          type: isImage ? 'image' : 'audio',
          url,
          name: file.name
        };
        
        setMediaFiles(prev => [...prev, mediaFile]);
        setDenunciaData(prev => ({
          ...prev,
          evidencias: [...(prev.evidencias || []), file]
        }));
      }
    });
  };

  // Função para iniciar gravação de áudio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], `audio_${Date.now()}.wav`, { type: 'audio/wav' });
        
        const id = generateId();
        const url = URL.createObjectURL(audioBlob);
        
        const mediaFile: MediaFile = {
          id,
          file: audioFile,
          type: 'audio',
          url,
          name: `Gravação ${new Date().toLocaleTimeString()}`
        };
        
        setMediaFiles(prev => [...prev, mediaFile]);
        setDenunciaData(prev => ({
          ...prev,
          evidencias: [...(prev.evidencias || []), audioFile]
        }));
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      toast({
        title: "Erro ao acessar microfone",
        description: "Verifique se você permitiu o acesso ao microfone.",
        variant: "destructive",
      });
    }
  };

  // Função para parar gravação
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  // Função para reproduzir áudio
  const playAudio = (audioUrl: string, audioId: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.onended = () => setPlayingAudio(null);
    audio.play();
    setPlayingAudio(audioId);
  };

  // Função para pausar áudio
  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingAudio(null);
    }
  };

  // Função para remover arquivo de mídia
  const removeMediaFile = (id: string) => {
    const fileToRemove = mediaFiles.find(file => file.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
      setMediaFiles(prev => prev.filter(file => file.id !== id));
      setDenunciaData(prev => ({
        ...prev,
        evidencias: prev.evidencias?.filter(file => file !== fileToRemove.file) || []
      }));
    }
  };

  // Função para formatar tempo de gravação
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!denunciaData.relato.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, descreva a situação que deseja relatar.",
        variant: "destructive",
      });
      return;
    }

    if (!denunciaData.tipoViolencia) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, selecione o tipo de violência.",
        variant: "destructive",
      });
      return;
    }

    if (!denunciaData.dataOcorrido) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe a data em que ocorreu a situação.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Salvar denúncia usando o serviço real
      const novaDenuncia = await denunciaService.criarDenuncia(denunciaData);
      
      // Mostrar modal de confirmação
      setDenunciaConfirmada({
        id: novaDenuncia.idPublico,
        tipo: novaDenuncia.tipoViolencia
      });
      setShowConfirmModal(true);
      
      // Limpar formulário
      setDenunciaData({
        relato: "",
        tipoViolencia: "",
        dataOcorrido: "",
        localizacao: {},
        evidencias: []
      });
      setDataDisplay(""); // Limpar também a data de exibição
      
      // Limpar arquivos de mídia
      mediaFiles.forEach(file => URL.revokeObjectURL(file.url));
      setMediaFiles([]);
      
    } catch (error) {
      console.error('Erro ao salvar denúncia:', error);
      toast({
        title: "Erro ao enviar denúncia",
        description: "Tente novamente. Se o problema persistir, entre em contato conosco.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setDenunciaConfirmada(null);
    // Navegar automaticamente para a página inicial após fechar o modal
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <div className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-emergency rounded-full flex items-center justify-center mx-auto mb-6 shadow-strong">
              <AlertTriangle className="text-emergency-foreground" size={40} />
          </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">
            Fazer Denúncia Anônima
          </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Seu relato é importante e será tratado com total confidencialidade
          </p>
        </div>

        {/* Security Notice */}
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 shadow-soft">
          <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="text-primary-foreground" size={24} />
                </div>
              <div>
                  <h3 className="font-semibold text-primary text-lg mb-2">
                    Garantia de Anonimato Total
                </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                  Esta denúncia é 100% anônima. Não coletamos dados pessoais, 
                  endereço IP ou qualquer informação que possa identificá-la. 
                    Você está completamente protegida.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulário */}
          <Card className="shadow-strong border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-primary-foreground" size={28} />
              </div>
              <CardTitle className="text-2xl text-primary">Relatar Situação</CardTitle>
              <CardDescription className="text-base">
              Descreva o que aconteceu da forma que se sentir confortável
            </CardDescription>
          </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Tipo de Violência */}
                <div className="space-y-3">
                  <Label htmlFor="tipoViolencia" className="text-base font-semibold flex items-center space-x-2">
                    <AlertTriangle className="text-emergency" size={18} />
                    <span>Tipo de Violência *</span>
                  </Label>
                  <div className="relative">
                    <Select 
                      value={denunciaData.tipoViolencia} 
                      onValueChange={(value) => setDenunciaData(prev => ({ ...prev, tipoViolencia: value }))}
                    >
                      <SelectTrigger className="h-12 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-primary/50 focus:border-primary transition-all duration-300 rounded-xl">
                        <SelectValue placeholder="Selecione o tipo de violência" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2">
                        <SelectItem value="fisica" className="rounded-lg">Violência Física</SelectItem>
                        <SelectItem value="psicologica" className="rounded-lg">Violência Psicológica</SelectItem>
                        <SelectItem value="sexual" className="rounded-lg">Violência Sexual</SelectItem>
                        <SelectItem value="economica" className="rounded-lg">Violência Econômica</SelectItem>
                        <SelectItem value="moral" className="rounded-lg">Violência Moral</SelectItem>
                        <SelectItem value="patrimonial" className="rounded-lg">Violência Patrimonial</SelectItem>
                        <SelectItem value="outros" className="rounded-lg">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Data do Ocorrido */}
                <div className="space-y-3">
                  <Label htmlFor="dataOcorrido" className="text-base font-semibold flex items-center space-x-2">
                    <Calendar className="text-blue-500" size={18} />
                    <span>Data do Ocorrido</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      id="dataOcorrido"
                      value={denunciaData.dataOcorrido}
                      onChange={(e) => {
                        const dateValue = e.target.value; // Formato YYYY-MM-DD (padrão HTML5)
                        if (dateValue) {
                          // Manter formato americano no estado (para compatibilidade com HTML5)
                          setDenunciaData(prev => ({ ...prev, dataOcorrido: dateValue }));
                          
                          // Converter para formato brasileiro para exibição
                          const [year, month, day] = dateValue.split('-');
                          const brazilianDate = `${day}/${month}/${year}`;
                          setDataDisplay(brazilianDate);
                        } else {
                          setDenunciaData(prev => ({ ...prev, dataOcorrido: '' }));
                          setDataDisplay('');
                        }
                      }}
                      className="h-12 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-500 transition-all duration-300 rounded-xl pl-4"
                    />
                  </div>
                  {/* Mostrar data formatada para o usuário */}
                  {dataDisplay && (
                    <div className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                      📅 Data selecionada: {dataDisplay}
                    </div>
                  )}
                </div>

                {/* Localização */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center space-x-2">
                    <MapPin className="text-green-500" size={18} />
                    <span>Localização (Opcional)</span>
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="Sua cidade"
                        value={denunciaData.localizacao?.cidade || ""}
                        onChange={(e) => setDenunciaData(prev => ({ 
                          ...prev, 
                          localizacao: { ...prev.localizacao, cidade: e.target.value }
                        }))}
                        className="h-12 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 hover:border-green-400 focus:border-green-500 transition-all duration-300 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Seu estado"
                        value={denunciaData.localizacao?.estado || ""}
                        onChange={(e) => setDenunciaData(prev => ({ 
                          ...prev, 
                          localizacao: { ...prev.localizacao, estado: e.target.value }
                        }))}
                        className="h-12 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 hover:border-green-400 focus:border-green-500 transition-all duration-300 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Seu bairro"
                        value={denunciaData.localizacao?.bairro || ""}
                        onChange={(e) => setDenunciaData(prev => ({ 
                          ...prev, 
                          localizacao: { ...prev.localizacao, bairro: e.target.value }
                        }))}
                        className="h-12 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 hover:border-green-400 focus:border-green-500 transition-all duration-300 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

              {/* Relato por texto */}
                <div className="space-y-3">
                  <Label htmlFor="relato" className="text-base font-semibold flex items-center space-x-2">
                    <FileText className="text-purple-500" size={18} />
                    <span>Descrição da situação *</span>
                </Label>
                  <div className="relative">
                <Textarea
                  id="relato"
                  placeholder="Descreva a situação que você vivenciou..."
                      value={denunciaData.relato}
                      onChange={(e) => setDenunciaData(prev => ({ ...prev, relato: e.target.value }))}
                      className="min-h-[180px] resize-none bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 hover:border-purple-400 focus:border-purple-500 transition-all duration-300 rounded-xl p-4 text-base"
                  maxLength={2000}
                />
                    <div className="absolute bottom-3 right-3">
                      <span className="text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded-full">
                        {denunciaData.relato.length}/2000
                      </span>
                    </div>
                  </div>
              </div>

              {/* Opções de anexos */}
              <div className="space-y-4">
                  <Label className="text-base font-semibold flex items-center space-x-2">
                    <Upload className="text-orange-500" size={18} />
                    <span>Evidências (Opcional)</span>
                </Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Botão Câmera */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCameraCapture}
                      className="h-16 bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-200 transition-all duration-300 rounded-xl flex flex-col items-center justify-center space-y-1"
                    >
                      <Camera className="text-orange-500" size={20} />
                      <span className="text-xs font-medium">Foto</span>
                    </Button>

                    {/* Botão Galeria */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleFileSelect}
                      className="h-16 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-200 transition-all duration-300 rounded-xl flex flex-col items-center justify-center space-y-1"
                    >
                      <FileImage className="text-blue-500" size={20} />
                      <span className="text-xs font-medium">Galeria</span>
                    </Button>

                    {/* Botão Gravação */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`h-16 border-2 transition-all duration-300 rounded-xl flex flex-col items-center justify-center space-y-1 ${
                        isRecording 
                          ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-400 hover:bg-red-200' 
                          : 'bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:border-green-400 hover:bg-green-200'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <Pause className="text-red-500" size={20} />
                          <span className="text-xs font-medium">{formatRecordingTime(recordingTime)}</span>
                        </>
                      ) : (
                        <>
                          <Mic className="text-green-500" size={20} />
                          <span className="text-xs font-medium">Áudio</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Arquivos anexados */}
                  {mediaFiles.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground">Arquivos anexados:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mediaFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                          >
                            {file.type === 'image' ? (
                              <FileImage className="text-blue-500" size={16} />
                            ) : (
                              <FileAudio className="text-green-500" size={16} />
                            )}
                            <span className="flex-1 text-sm truncate">{file.name}</span>
                            {file.type === 'audio' && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => playingAudio === file.id ? pauseAudio() : playAudio(file.url, file.id)}
                                className="h-8 w-8 p-0"
                              >
                                {playingAudio === file.id ? (
                                  <Pause className="text-green-500" size={14} />
                                ) : (
                                  <Play className="text-green-500" size={14} />
                                )}
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMediaFile(file.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Botão de envio */}
                <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                    className="w-full h-14 bg-gradient-emergency hover:bg-gradient-emergency/90 text-white font-semibold text-lg rounded-xl shadow-strong transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Enviando...</span>
                      </div>
                  ) : (
                      <div className="flex items-center space-x-2">
                      <Send size={20} />
                        <span>Enviar Denúncia Anônima</span>
                      </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

          {/* Inputs ocultos para arquivos */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,audio/*"
            multiple
            onChange={(e) => e.target.files && processFiles(e.target.files)}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => e.target.files && processFiles(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* Modal de Confirmação */}
      {denunciaConfirmada && (
        <DenunciaConfirmModal
          isOpen={showConfirmModal}
          onClose={handleCloseConfirmModal}
          denunciaId={denunciaConfirmada.id}
          tipoViolencia={denunciaConfirmada.tipo}
        />
      )}
    </div>
  );
};

export default Denuncia;