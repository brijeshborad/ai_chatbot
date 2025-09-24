import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserInputService } from '../../services/user-input.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { APIService } from '../../services/api.service';


export interface HistoryItem {
  role: string;
  content: string;
  timestamp: string;
}

interface ChatHistory {
  email: string;
  history: HistoryItem[];
}


@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        FormsModule, 
        CommonModule,
        SweetAlert2Module
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent {
  userInput = '';
  errMsg = ''

  constructor(
    private router: Router, 
    private userInputService: UserInputService,
    private apiService: APIService) {}
  
    private isValidEmail(email: string): boolean {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    onStartChat() {
        if (this.userInput.trim()) {
            if (this.isValidEmail(this.userInput.trim())) {
                this.getChat(this.userInput.trim())
                /*this.errMsg = ''; // clear error
                this.userInputService.setInitialMessage(this.userInput.trim());
                this.router.navigate(['/chat']);*/
            } else {
                this.errMsg = 'Please enter a valid email address';
            }
        } else {
          this.errMsg = 'Email is required';
        }
    }

    onKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.onStartChat();
        }
    }

    redirectToChat(){

        this.userInputService.setInitialMessage(this.userInput.trim());
        this.router.navigate(['/chat']);
    }

    getChat(initial:any){

        this.apiService.get<ChatHistory>('chats/'+initial).subscribe({
            next: (response:ChatHistory) => {
                console.log('Content saved:', response);                
                if(response.history.length > 0){

                    Swal.fire({
                        title: "Do you want to start from where you left off?",
                        showCancelButton: true,
                        confirmButtonText: "Yes, Let's Continue!",
                        cancelButtonText: "No, Start New Chat!",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.redirectToChat();
                        } else {
                            this.updateChat(initial);
                        }
                    });
                }else{
                    this.redirectToChat();
                }
            },
            error: (err) => {
              console.error('Failed to save content:', err);
            }
        });
    }

    updateChat(initial:any){

        this.apiService.put(`chats/${initial}/end`,{}).subscribe({
            next: (response) => {
                console.log('Content saved:', response);                
                this.redirectToChat()
            },
            error: (err) => {
              console.error('Failed to save content:', err);
            }
        });
    }
}