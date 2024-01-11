import { Component, OnInit } from '@angular/core';

interface Timer {
  id: number;
  name: string;
  value: number;
  intervalObj?: { interval: any } | null;
  totalTime: number;
}
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {
  timers: Timer[] = [
    { id: 1, name: 'Timer 1', value: 900, totalTime: 0 },
    { id: 2, name: 'Timer 2', value: 600, totalTime: 0 },
    { id: 3, name: 'Timer 3', value: 400, totalTime: 0 },
    { id: 4, name: 'Timer 4', value: 300, totalTime: 0 },
    // Add more timers as needed
  ];
  intervalObjs: { id: number; interval: any }[] = [];
  originalTimerValues: { [key: number]: number } = {};
  showTotalTime: { [key: number]: boolean } = {};

  ngOnInit(): void {
    this.timers.forEach(timer => {
      this.originalTimerValues[timer.id] = timer.value;
      this.showTotalTime[timer.id] = false;
    });
    this.restoreTimers();
  }


  restoreTimers(): void {
    // Restore timers from local storage
    this.timers.forEach((timer) => {
      const storedValue = localStorage.getItem(`timer_${timer.id}`);
      const timerState = localStorage.getItem(`timerState_${timer.id}`);

      if (storedValue) {
        timer.value = parseInt(storedValue, 10);
      }

      if (timerState === 'running') {
        this.startTimer(timer);
      }
    });
  }

  resumeTimer(timer: Timer): void {
    if (localStorage.getItem(`timerState_${timer.id}`) === 'stopped') {
      this.startTimer(timer);
    }
  }

  startTimer(timer: Timer): void {
    if (!timer.intervalObj) {
      timer.intervalObj = {
        interval: setInterval(() => {
          if (timer.value > 0) {
            timer.value--;
            localStorage.setItem(`timer_${timer.id}`, timer.value.toString());
            localStorage.setItem(`timerState_${timer.id}`, 'running');
          } else {
            this.resetTimer(timer);
          }
        }, 1000),
      };
    }
  }

  pauseTimer(timer: Timer): void {
    if (timer.intervalObj) {
      clearInterval(timer.intervalObj.interval);
      localStorage.setItem(`timerState_${timer.id}`, 'paused');
      timer.intervalObj = null;
    }
  }

  resetTimer(timer: Timer): void {
    clearInterval(timer.intervalObj?.interval);
    timer.value = this.originalTimerValues[timer.id] || 0; // Reset to original value
    localStorage.setItem(`timer_${timer.id}`, timer.value.toString());
    localStorage.setItem(`timerState_${timer.id}`, 'stopped');
    timer.intervalObj = null;
  }



  stopWatch(timer: Timer): void {
    if (timer.intervalObj) {
      timer.totalTime = this.originalTimerValues[timer.id] - timer.value;
      this.showTotalTime[timer.id] = true;
      clearInterval(timer.intervalObj.interval);
      localStorage.setItem(`timerState_${timer.id}`, 'stopped');
      timer.intervalObj = null;
    }
  }

  formatTimer(timer: Timer): string {
    const minutes: number = Math.floor(timer.value / 60);
    const seconds: number = timer.value % 60;

    const formattedMinutes: string =
      minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds: string =
      seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${timer.name} - ${formattedMinutes}:${formattedSeconds}`;
  }

  formatTotalTime(timer: Timer): string {
    const minutes: number = Math.floor(timer.totalTime / 60);
    const seconds: number = timer.totalTime % 60;

    const formattedMinutes: string =
      minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds: string =
      seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `Total Time : ${formattedMinutes}:${formattedSeconds}`;
  }

  getTimerState(timerId: number): string {
    return localStorage.getItem(`timerState_${timerId}`) || 'stopped';
  }

}
