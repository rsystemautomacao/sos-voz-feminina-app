import { useState, useRef } from "react";
import { AlertTriangle, Camera, Mic, Send, Shield, X, Play, Pause, Upload, FileAudio, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api.ts";

interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'audio';
  url: string;
  name: string;
}

interface DenunciaData {
  relato: string;
  tipoViolencia: string;
  dataOcorrido: string;
  localizacao: {
    cidade?: string;
    estado?: string;
    bairro?: string;
  };
  evidencias: File[];
}

const Denuncia = () => {
  const [denunciaData, setDenunciaData] = useState<DenunciaData>({
    relato: "",
    tipoViolencia: "",
    dataOcorrido: "",
    localizacao: {},
    evidencias: []
  });
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  
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
          evidencias: [...prev.evidencias, file]
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
          evidencias: [...prev.evidencias, audioFile]
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
      }
    }
  };

  // Função para reproduzir áudio
  const playAudio = (audioUrl: string, id: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setPlayingAudio(id);
      
      audioRef.current.onended = () => {
        setPlayingAudio(null);
      };
    }
  };

  // Função para pausar áudio
  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingAudio(null);
    }
  };

  // Função para remover arquivo
  const removeFile = (id: string) => {
    setMediaFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
        setDenunciaData(prevData => ({
          ...prevData,
          evidencias: prevData.evidencias.filter(f => f !== fileToRemove.file)
        }));
      }
      return prev.filter(f => f.id !== id);
    });
  };

  // Função para formatar tempo
  const formatTime = (seconds: number) => {
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

    setIsSubmitting(true);
    
    try {
      await apiService.criarDenuncia(denunciaData);
      
      toast({
        title: "Denúncia registrada com sucesso",
        description: "Sua denúncia foi recebida de forma anônima e será analisada. Você é corajosa!",
      });
      
      // Limpar formulário
      setDenunciaData({
        relato: "",
        tipoViolencia: "",
        dataOcorrido: "",
        localizacao: {},
        evidencias: []
      });
      
      // Limpar arquivos de mídia
      mediaFiles.forEach(file => URL.revokeObjectURL(file.url));
      setMediaFiles([]);
      
    } catch (error) {
      toast({
        title: "Erro ao enviar denúncia",
        description: "Tente novamente. Se o problema persistir, entre em contato conosco.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-emergency rounded-full flex items-center justify-center mx-auto mb-4 shadow-strong">
            <AlertTriangle className="text-emergency-foreground" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Fazer Denúncia Anônima
          </h1>
          <p className="text-muted-foreground">
            Seu relato é importante e será tratado com total confidencialidade
          </p>
        </div>

        {/* Security Notice */}
        <Card className="mb-8 border-primary-lighter bg-primary-lighter/10">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="text-primary mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold text-primary mb-1">
                  Garantia de Anonimato
                </h3>
                <p className="text-sm text-muted-foreground">
                  Esta denúncia é 100% anônima. Não coletamos dados pessoais, 
                  endereço IP ou qualquer informação que possa identificá-la. 
                  Você está protegida.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulário */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-primary">Relatar Situação</CardTitle>
            <CardDescription>
              Descreva o que aconteceu da forma que se sentir confortável
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de Violência */}
              <div className="space-y-2">
                <Label htmlFor="tipoViolencia" className="text-base font-medium">
                  Tipo de Violência *
                </Label>
                <Select 
                  value={denunciaData.tipoViolencia} 
                  onValueChange={(value) => setDenunciaData(prev => ({ ...prev, tipoViolencia: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de violência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fisica">Violência Física</SelectItem>
                    <SelectItem value="psicologica">Violência Psicológica</SelectItem>
                    <SelectItem value="sexual">Violência Sexual</SelectItem>
                    <SelectItem value="economica">Violência Econômica</SelectItem>
                    <SelectItem value="moral">Violência Moral</SelectItem>
                    <SelectItem value="patrimonial">Violência Patrimonial</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Data do Ocorrido */}
              <div className="space-y-2">
                <Label htmlFor="dataOcorrido" className="text-base font-medium">
                  Data do Ocorrido
                </Label>
                <Input
                  type="date"
                  id="dataOcorrido"
                  value={denunciaData.dataOcorrido}
                  onChange={(e) => setDenunciaData(prev => ({ ...prev, dataOcorrido: e.target.value }))}
                />
              </div>

              {/* Localização */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    placeholder="Sua cidade"
                    value={denunciaData.localizacao.cidade || ""}
                    onChange={(e) => setDenunciaData(prev => ({ 
                      ...prev, 
                      localizacao: { ...prev.localizacao, cidade: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    placeholder="Seu estado"
                    value={denunciaData.localizacao.estado || ""}
                    onChange={(e) => setDenunciaData(prev => ({ 
                      ...prev, 
                      localizacao: { ...prev.localizacao, estado: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    placeholder="Seu bairro"
                    value={denunciaData.localizacao.bairro || ""}
                    onChange={(e) => setDenunciaData(prev => ({ 
                      ...prev, 
                      localizacao: { ...prev.localizacao, bairro: e.target.value }
                    }))}
                  />
                </div>
              </div>

              {/* Relato por texto */}
              <div className="space-y-2">
                <Label htmlFor="relato" className="text-base font-medium">
                  Descrição da situação *
                </Label>
                <Textarea
                  id="relato"
                  placeholder="Conte o que aconteceu... Você pode incluir detalhes como data, local, pessoas envolvidas, testemunhas, etc. Lembre-se: quanto mais informações, melhor poderemos ajudar."
                  value={denunciaData.relato}
                  onChange={(e) => setDenunciaData(prev => ({ ...prev, relato: e.target.value }))}
                  className="min-h-[150px] resize-none"
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {denunciaData.relato.length}/2000 caracteres
                </p>
              </div>

              {/* Opções de anexos */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Evidências (opcional)
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className="border-dashed border-2 border-border hover:border-primary transition-colors cursor-pointer"
                    onClick={handleCameraCapture}
                  >
                    <CardContent className="pt-6 text-center">
                      <Camera className="mx-auto mb-2 text-muted-foreground" size={24} />
                      <p className="text-sm font-medium">Tirar Foto</p>
                      <p className="text-xs text-muted-foreground">
                        Usar câmera do celular
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className="border-dashed border-2 border-border hover:border-primary transition-colors cursor-pointer"
                    onClick={handleFileSelect}
                  >
                    <CardContent className="pt-6 text-center">
                      <Upload className="mx-auto mb-2 text-muted-foreground" size={24} />
                      <p className="text-sm font-medium">Anexar Arquivos</p>
                      <p className="text-xs text-muted-foreground">
                        Fotos, documentos, etc.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Gravação de áudio */}
                <Card className="border-dashed border-2 border-border">
                  <CardContent className="pt-6 text-center">
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        type="button"
                        variant={isRecording ? "destructive" : "outline"}
                        size="sm"
                        onClick={isRecording ? stopRecording : startRecording}
                        className="flex items-center space-x-2"
                      >
                        {isRecording ? (
                          <>
                            <Pause size={16} />
                            Parar Gravação ({formatTime(recordingTime)})
                          </>
                        ) : (
                          <>
                            <Mic size={16} />
                            Gravar Áudio
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {isRecording ? "Gravando... Clique para parar" : "Clique para gravar seu relato em áudio"}
                    </p>
                  </CardContent>
                </Card>

                {/* Arquivos de mídia capturados */}
                {mediaFiles.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Arquivos anexados:</Label>
                    <div className="space-y-2">
                      {mediaFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center space-x-3">
                            {file.type === 'image' ? (
                              <FileImage size={20} className="text-blue-500" />
                            ) : (
                              <FileAudio size={20} className="text-green-500" />
                            )}
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {file.type === 'image' ? 'Imagem' : 'Áudio'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {file.type === 'audio' && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (playingAudio === file.id) {
                                    pauseAudio();
                                  } else {
                                    playAudio(file.url, file.id);
                                  }
                                }}
                              >
                                {playingAudio === file.id ? (
                                  <Pause size={16} />
                                ) : (
                                  <Play size={16} />
                                )}
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  💡 Dica: Evidências ajudam na investigação, mas não são obrigatórias
                </p>
              </div>

              {/* Botão de envio */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  variant="emergency" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Enviando denúncia...</>
                  ) : (
                    <>
                      <Send size={20} />
                      Enviar Denúncia Anônima
                    </>
                  )}
                </Button>
                
                <p className="text-center text-xs text-muted-foreground mt-3">
                  Ao enviar, você concorda que as informações serão usadas apenas 
                  para investigação e apoio necessário
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">
              O que acontece após a denúncia?
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Sua denúncia será analisada por profissionais qualificados</li>
              <li>• Medidas de proteção serão avaliadas se necessário</li>
              <li>• Você pode retornar a qualquer momento para atualizar informações</li>
              <li>• Mantenha os contatos de apoio salvos para emergências</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Inputs ocultos para captura de mídia */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,audio/*"
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
      
      {/* Audio element para reprodução */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default Denuncia;