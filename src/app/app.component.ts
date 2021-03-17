import { Component, OnInit } from '@angular/core';
import {CardInterface} from 'src/app/interfaces/card-interface';
import { interval, Subscription, timer } from 'rxjs';
import {takeWhile, tap, take} from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'lucky-or-smart';
  cardImages= ['pDGNBK9A0sk',
          'fYDrhbVlV1E',
          'qoXgaF27zBc',
          'b9drVB7xIOI',
          'pDGNBK9A0sk',
          'fYDrhbVlV1E',
          'qoXgaF27zBc',
          'b9drVB7xIOI',
          'pDGNBK9A0sk',
          'fYDrhbVlV1E',
          'qoXgaF27zBc',
          'b9drVB7xIOI',
          'pDGNBK9A0sk',
          'fYDrhbVlV1E',
  ];

  cards: CardInterface[] = [];

  flippedCards: CardInterface[] = [];

  matchedCount : number = 0;

  points : number = 75;

  tries : number = 6;

  clicks : number = 0;

  timeLeft: number = 0;

  minutes: number = 6;

  seconds: number = 0;

  showSeconds: string = "00";

  timerSub: Subscription;

  shuffleArray(anArray: any[]): any[] {
    return anArray.map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  }

  constructor() {}

  ngOnInit(){
    this.setupCards();
  }

  setupCards(): void {
    this.cards = [];
    this.cardImages.forEach((image) => {
      const cardData: CardInterface = {
        imageId: image,
        state: 'default'
      };

      this.cards.push({ ...cardData });
      this.cards.push({ ...cardData });

    });

    this.cards = this.shuffleArray(this.cards);
  }

  cardClicked(index: number): void {
    const cardInfo = this.cards[index];
    if (this.tries == 6 && this.clicks == 0) {
      this.clicks++;
      this.startTimer();
    }
    if (this.tries !== 0) {
      if (cardInfo.state === 'default' && this.flippedCards.length < 2) {
        cardInfo.state = 'flipped';
        this.flippedCards.push(cardInfo);

        if (this.flippedCards.length > 1) {
          this.checkForCardMatch();
        }
      }
    }
  }

  checkForCardMatch(): void {
    setTimeout(() => {
      const cardOne = this.flippedCards[0];
      const cardTwo = this.flippedCards[1];
      const nextState = cardOne.imageId === cardTwo.imageId ? 'matched' : 'default';
      cardOne.state = cardTwo.state = nextState;

      this.flippedCards = [];

      if (nextState === 'matched') {
        this.matchedCount++;
        this.tries--;
        if (this.matchedCount === this.cardImages.length) {
          this.restart();
        }

        if (this.tries == 0) {
          this.timerSub.unsubscribe();
        }
      }else{
        this.points -= 5;
        this.tries--;
        if (this.tries == 0) {
          this.timerSub.unsubscribe();
        }
      }

    }, 1000);
  }

  restart(): void {
    this.matchedCount = 0;
    this.setupCards();
  }

  startTimer(){
    const timerInterval$ = interval(1000); //1s
    const timer$ = timer(360000); //6min
    const time = 360;
    const countDown$ = timerInterval$.pipe(take(time));
    this.timerSub = countDown$.subscribe(val =>{
      console.log(Math.floor((time - val)/60))
      this.minutes = Math.floor((time - val)/60)
      this.seconds = (time - val) - this.minutes * 60;
      this.showSeconds = (this.seconds < 10 ? '0' : '') + this.seconds;
    });
    const sub1 = timer$.subscribe(val => {
      this.tries = 0;
    });
  }

  getVoucher(){
    console.log(this.points);
  }
}
