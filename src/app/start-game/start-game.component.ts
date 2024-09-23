import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-start-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-game.component.html',
  styleUrl: './start-game.component.scss',
})
export class StartGameComponent {
  randomNumbers$: number[] = [];
  currentNumber: number = 1;
  timeLeft: number = 240;
  gameOver: boolean = false;
  timer: any;
  formattedTimeLeft: string = '04:00';
  resultMessage: string = '';
  remainingNumbers: number = 100;
  currentPosition: number = 0;
  gameStarted: boolean = false;
  resultMessageClass: string = '';

  constructor() {
    this.generateRandomNumbers();
  }

  ngOnInit(): void {
    this.generateRandomNumbers();
  }

  startGame(): void {
    this.giveUp();
    this.gameStarted = true;
    this.startTimer();
  }

  giveUp(): void {
    clearInterval(this.timer);
    this.gameStarted = false;
    this.gameOver = false;
    this.currentNumber = 1;
    this.currentPosition = 0;
    this.remainingNumbers = 100;
    this.timeLeft = 240;
    this.formattedTimeLeft = '04:00';
    this.resultMessage = '';
    this.resultMessageClass = '';
    this.generateRandomNumbers();
  }

  shuffleArray(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  generateRandomNumbers(): void {
    const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
    this.randomNumbers$ = this.shuffleArray(numbers);
  }

  startTimer(): void {
    this.formatedTimer();
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.formatedTimer();
      } else {
        this.endGame(false);
      }
    }, 1000);
  }

  formatedTimer(): void {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.formattedTimeLeft = `${this.showNumber(minutes)}:${this.showNumber(
      seconds
    )}`;
  }

  showNumber(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  selectNumber(selectedNumber: number): void {
    if (!this.gameStarted || this.gameOver) return;

    if (selectedNumber === this.currentNumber) {
      this.currentNumber++;
      this.remainingNumbers--;
      this.currentPosition++;
      if (this.currentNumber > 100) {
        this.endGame(true);
      }
    } else if (selectedNumber > this.currentNumber) {
      this.endGame(false);
    }
  }

  endGame(win: boolean): void {
    clearInterval(this.timer);
    this.gameOver = true;
    this.resultMessage = win
      ? 'Congratulations! You won!'
      : 'Game Over! You lost.';
    this.resultMessageClass = win ? 'win' : 'lose';
  }

  getNumberClass(number: number): string {
    return number < this.currentNumber ? 'selected' : '';
  }
}
