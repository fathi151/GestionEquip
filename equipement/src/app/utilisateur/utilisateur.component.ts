import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { UtilisateurService } from './utilisateur.service';
import { Router } from '@angular/router';
import { Utilisateur } from './Utilisateur';
import { Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.css']
})
export class UtilisateurComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('video') videoElementRef!: ElementRef<HTMLVideoElement>;

  methode: 'password' | 'face' = 'password';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  cameraStarted = false;
  cameraStream: MediaStream | null = null;

  // Notification system
  notification = {
    show: false,
    type: 'success', // 'success' or 'error'
    message: ''
  };
  showWebcam: boolean = false;

  resultMessage: string = '';

  trigger: Subject<void> = new Subject<void>();
 webcamImage: WebcamImage | null = null;
  user: Utilisateur = new Utilisateur();

  constructor(private userService: UtilisateurService, private router: Router,private http: HttpClient) {}

  ngOnInit(): void {
    localStorage.clear();

  }

  // Méthodes pour les notifications
  showNotification(type: 'success' | 'error', message: string) {
    this.notification = {
      show: true,
      type: type,
      message: message
    };

    // Auto-hide après 2 secondes
    setTimeout(() => {
      this.hideNotification();
    }, 2000);
  }

  hideNotification() {
    this.notification.show = false;
  }

  ngAfterViewInit(): void {
    if (this.methode === 'face') {
      this.startCamera();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['methode']) {
      const newValue = changes['methode'].currentValue;
      if (newValue === 'face') {
        this.startCamera();
      } else if (newValue === 'password') {
        this.stopCamera();
      }
    }
  }

  setMethode(type: 'password' | 'face') {
    this.methode = type;

    if (type === 'face') {
      setTimeout(() => this.startCamera(), 0);
    } else if (type === 'password') {
      this.stopCamera();
    }
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    const user = { registrationNumber: this.email, password: this.password };

    this.userService.login(user).subscribe(
      (response) => {
        this.userService.redirectToDashboard();


      },
      (error) => {
        console.error('Erreur de connexion :', error);
        this.errorMessage = 'Nom d’utilisateur ou mot de passe incorrect';
      }
    );
  }

  startCamera(): void {
    if (this.cameraStarted || !this.videoElementRef) return;

    const video = this.videoElementRef.nativeElement;

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        this.cameraStream = stream;
        this.cameraStarted = true;
      })
      .catch((error) => {
        console.error('Erreur accès caméra :', error);
        this.showNotification('error', 'Impossible d\'accéder à la caméra');
      });
  }

  stopCamera(): void {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
      this.cameraStarted = false;

      if (this.videoElementRef?.nativeElement) {
        this.videoElementRef.nativeElement.srcObject = null;
      }
    }
  }
triggerSnapshot(): void {
  console.log("Snapshot triggered");
  this.trigger.next();
}

  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  console.log("Image captured:", webcamImage);
    const headers = {
      'Content-Type': 'application/json'
    };

    this.http.post('http://127.0.0.1:5000/verify-face', {
      image: webcamImage.imageAsDataUrl
    }, {
      headers: headers,
      withCredentials: true // Important for handling credentials
    }).subscribe((res: any) => {
      this.resultMessage = res.verified ? "✅ Face Verified!" : "❌ Verification Failed";

      if (res.verified) {
        this.router.navigate(['/dashboard']); // Adjust route as needed
      }
    }, error => {
      console.error("Verification error:", error);
      this.resultMessage = "❌ Error during verification.";
    });
  }
}
