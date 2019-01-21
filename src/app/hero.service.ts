import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {


  private heroesUrl = 'api/heroes';

  constructor(private http : HttpClient,
    private messageService: MessageService) { }

  getHeroes(): Observable<Hero[]>{
    this.messageService.add('HeroService: Heroes fetched');
    //return of(HEROES);
    return this.http.get<Hero[]>(this.heroesUrl)
                  .pipe(
                    tap(heroes => this.log(`heroes fetched`)),
                    catchError(this.handleError('getHeroes', []))
                  );
  }

  getHero(id: number): Observable<Hero>{
    const url = `${this.heroesUrl}/${id}`;

    return this.http.get<Hero>(url)
                .pipe(
                  tap(_=> this.messageService.add(`fetched hero id=${id}`)),
                  catchError(this.handleError<Hero>(`getHero id = ${id}`))
                );
    this.messageService.add(`HeroService: Fetched hero id=${id}`);
    return of(HEROES.find(hero=> hero.id === id));
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
            tap(_ => this.log(`updated hero id: ${hero.id}`)),
            catchError(this.handleError<any>(`updateHero`))
    );
  }

  addHero(hero: Hero): Observable<Hero>{
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
            .pipe(
              tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
              catchError(this.handleError<Hero>(`addedHero`))
            );
  }

  deleteHero(hero: Hero | number): Observable<Hero>{
    const id = typeof hero === 'number'?hero: hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions)
            .pipe(
              tap(_ => this.log(`deleted hero id: ${id}`)),
              catchError(this.handleError<Hero>(`deletedHero`))
            );
  }

  private log(message: string){
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.log(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }
}
