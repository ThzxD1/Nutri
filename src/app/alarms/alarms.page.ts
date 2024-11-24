import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.page.html',
  styleUrls: ['./alarms.page.scss'],
})
export class AlarmsPage implements OnInit {
  alarmes: any[] = [];

  newAlarm = {
    name: '',
    message: '',
    timeMinutes: 10, // Intervalo em minutos, padrão de 10 minutos
    timeSeconds: 0,  // Intervalo em segundos, padrão de 0 segundos
    active: false,
    id: 0,
    timeRemaining: 0, // Tempo restante
    alarmTime: 0  // Hora agendada para o alarme
  };

  constructor(private router: Router) { }

  ngOnInit() {
    this.requestPermission();
    this.startTimer(); // Iniciar o temporizador para atualizar os tempos
  }

  // Solicita permissão para enviar notificações
  async requestPermission() {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') {
      alert('A permissão para notificações foi negada. O sistema de lembretes não funcionará.');
    }
  }

  // Função para iniciar um novo alarme
  async startNewAlarm() {
    if (this.newAlarm.name && this.newAlarm.message && (this.newAlarm.timeMinutes >= 0 || this.newAlarm.timeSeconds >= 0)) {
      const alarmId = new Date().getTime(); // Usando o timestamp como ID único
      this.newAlarm.id = alarmId;

      // Verificando se o tempo do alarme foi configurado corretamente
      if (this.newAlarm.timeMinutes < 0 || this.newAlarm.timeSeconds < 0) {
        alert('O intervalo do alarme deve ser maior ou igual a zero.');
        return;
      }

      // Calculando o tempo total em milissegundos
      const totalTimeInMilliseconds = (this.newAlarm.timeMinutes * 60 * 1000) + (this.newAlarm.timeSeconds * 1000);
      const alarmTime = new Date(Date.now() + totalTimeInMilliseconds);

      // Adiciona o alarme à lista de alarmes ativos
      this.alarmes.push({
        ...this.newAlarm,
        active: true,
        timeRemaining: totalTimeInMilliseconds,
        alarmTime
      });

      // Agendar a notificação para o intervalo especificado
      await LocalNotifications.schedule({
        notifications: [
          {
            title: this.newAlarm.name,
            body: this.newAlarm.message,
            id: alarmId,
            schedule: { at: alarmTime }, // Hora agendada para o alarme
            sound: 'beep.wav', // Opcional, se você tiver um arquivo de som
            actionTypeId: 'ALERT',
            extra: null,
          },
        ],
      });

      // Limpar formulário
      this.newAlarm = { name: '', message: '', timeMinutes: 10, timeSeconds: 0, active: false, id: 0, timeRemaining: 0, alarmTime: 0 };
    } else {
      alert('Preencha todos os campos para configurar um alarme.');
    }
  }

  // Função para parar o alarme específico
  async stopAlarm(alarme: any) {
    await LocalNotifications.cancel({ notifications: [{ id: alarme.id }] });
    alarme.active = false; // Desativar alarme
  }

  // Atualiza o tempo restante de todos os alarmes ativos
  updateAlarmTimes() {
    this.alarmes.forEach((alarme) => {
      if (alarme.active) {
        const timeRemaining = alarme.alarmTime.getTime() - Date.now(); // Atualiza a diferença
        if (timeRemaining <= 0) {
          alarme.active = false; // Alarme foi disparado
        } else {
          alarme.timeRemaining = timeRemaining;
        }
      }
    });
  }

  // Intervalo para atualizar o tempo a cada segundo
  startTimer() {
    setInterval(() => {
      this.updateAlarmTimes();
    }, 1000); // Atualiza a cada 1 segundo
  }

  logout() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('Usuário deslogado com sucesso.');
        this.router.navigate(['/login']); 
      })
      .catch((error) => {
        console.error('Erro ao deslogar:', error);
      });
  }
}
