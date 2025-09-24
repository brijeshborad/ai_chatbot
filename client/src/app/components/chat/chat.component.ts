import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserInputService } from '../../services/user-input.service';
import { APIService } from '../../services/api.service';
import { environment } from '../../../environments/environment';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface HistoryItem {
  role: string;
  content: string;
  timestamp: string;
}

interface ChatHistory {
  email: string;
  history: HistoryItem[];
}

interface ChatResponse {
  bot_response: string;
}


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  
  messages: Message[] = [];
  currentMessage = '';
  isTyping = false;

  constructor(
    private router: Router,
    private userInputService: UserInputService,
    private apiService: APIService
    ) {}

    ngOnInit() {
        const initial = this.userInputService.getInitialMessage();
        if (initial) {

            this.apiService.get<ChatHistory>('chats/'+initial).subscribe({
                next: (response:ChatHistory) => {
                    console.log('Content saved:', response);
                    this.currentMessage = '';
                    if(response.history.length > 0){

                        response.history.map((h:HistoryItem)=>{

                            this.messages.push({
                                text: h.content,
                                isUser: (h.role=="user")?true:false,
                                timestamp: new Date()
                            });
                        })
                    }else{

                        this.messages.push({
                            text: "Hello! How can I help you today?",
                            isUser: false,
                            timestamp: new Date()
                        });
                    }
                },
                error: (err) => {
                  console.error('Failed to save content:', err);
                }
            });
        } else {
          this.router.navigate(['/']);
        }
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    sendMessage(messageText?: string) {
        const text = messageText || this.currentMessage.trim();

        const content = {
            message: text,
            email: this.userInputService.getInitialMessage()
        }

        this.messages.push({
            text: text,
            isUser: true,
            timestamp: new Date()
        });

        this.isTyping = true;

      this.apiService.post<ChatResponse>(environment.apiToGenerate, content).subscribe({
          next: (response:ChatResponse) => {
            console.log('Content saved:', response);
            this.currentMessage = '';
            // Add user message
            setTimeout(() => {
              this.messages.push({
                text: response.bot_response,
                isUser: false,
                timestamp: new Date()
            });
              this.isTyping = false;
          }, 1000 + Math.random() * 1000);        
        },
        error: (err) => {
            console.error('Failed to save content:', err);
        }
    });
    /*if (!text) return;

    // Add user message
    this.messages.push({
      text: text,
      isUser: true,
      timestamp: new Date()
    });

    this.currentMessage = '';
    this.isTyping = true;

    // Simulate AI response
    setTimeout(() => {
      this.generateAIResponse(text);
      this.isTyping = false;
    }, 1000 + Math.random() * 1000);*/
}

// private generateAIResponse(userMessage: string) {
//     const responses = [
//       "That's an interesting question! Let me think about that...",
//       "I understand what you're asking. Here's my perspective on this topic.",
//       "Great point! I'd like to add some thoughts to what you've shared.",
//       "Thank you for sharing that. I find this topic quite fascinating.",
//       "That's a thoughtful question. Let me provide you with some insights.",
//       "I appreciate your curiosity about this. Here's what I think..."
//   ];

//   const randomResponse = responses[Math.floor(Math.random() * responses.length)];

//   this.messages.push({
//       text: randomResponse,
//       isUser: false,
//       timestamp: new Date()
//   });
// }

    onKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    goHome() {
        this.router.navigate(['/']);
    }

    private scrollToBottom() {
        if (this.messagesContainer) {
          const element = this.messagesContainer.nativeElement;
          element.scrollTop = element.scrollHeight;
      }
    }

    startNewChat() {

        this.messages = [{
            text: "Hello! How can I help you today?",
            isUser: false,
            timestamp: new Date()
        }];
        this.currentMessage = '';
        this.isTyping = false;

        this.apiService.put(`chats/${this.userInputService.getInitialMessage()}/end`,{}).subscribe({
            next: (response) => {
                console.log('Content saved:', response);                
                //this.redirectToChat()
            },
            error: (err) => {
              console.error('Failed to save content:', err);
            }
        });
    }
}