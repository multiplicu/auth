import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface AuthUser {
	access_token?: string;
	expires_in?: number;
	name: string;
	picture: string;
	tellerId: number;
	token_type?: string;
	token?: string;
	userId: number;
	username?: string;
}

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	public token: string;
	public user$: Observable<AuthUser>;

	private isLoggedIn_: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	private headers_: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

	public constructor(private http_: HttpClient) {
		// Set token if saved in local storage
		const currentUser: AuthUser = this.currentUser;
		this.token = currentUser && currentUser.token;
	}

	public get currentUser(): AuthUser {
		if (!localStorage.getItem('currentUser')) {
			return null;
		}

		return JSON.parse(localStorage.getItem('currentUser'));
	}

	public isAuthenticated(): boolean {
		const user: AuthUser = this.currentUser;

		this.user$ = of(user);

		const isLoggedIn: boolean = user !== null;
		if (isLoggedIn) {
			this.isLoggedIn_.next(true);
		}

		return isLoggedIn;
	}

	public get isLoggedIn(): Observable<boolean> {
		return this.isLoggedIn_.asObservable();
	}

	/**
	 * Attempts a login request and returns an AuthUser if successful
	 *
	 * @param username
	 * @param password
	 * @param endpoint URL of the authorization service
	 */
	public login(username: string, password: string, endpoint: string): Observable<AuthUser> {
		const body = JSON.stringify({ username, password });

		return this.http_.post<AuthUser>(endpoint, body, { headers: this.headers_ }).pipe(
			tap((user: AuthUser) => {
				const token: string = user && user.access_token;

				if (token) {
					this.storeUser({
						username,
						token,
						userId: user.userId,
						name: user.name,
						tellerId: user.tellerId,
						picture: user.picture
					} as AuthUser);

					this.isLoggedIn_.next(true);
				}

				return user;
			})
		);
	}

	/**
	 * Clears out tokens and logged in user from local storage
	 */
	public logout(): void {
		// Clear token and remove the local storage user
		this.token = null;

		localStorage.removeItem('currentUser');
	}

	public storeUser(data: AuthUser): void {
		this.token = data.token;

		if (this.currentUser) {
			data = { ...this.currentUser, ...data };
		}

		localStorage.setItem('currentUser', JSON.stringify(data));

		// Set the user data for use throughout the application
		this.user$ = of(data);
	}
}
