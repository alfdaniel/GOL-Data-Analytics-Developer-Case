import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatToolbarModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <p>© 2024 GOL Linhas Aéreas. Todos os direitos reservados.</p>
        <div class="footer-links">
          <a href="#">Termos de Uso</a>
          <a href="#">Política de Privacidade</a>
          <a href="#">Contato</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #f5f5f5;
      padding: 24px 0;
      margin-top: auto;
      background-color: #FF7020;
    }

    .footer-content {
      width: 94%;
      max-width: 80rem;
      margin: 0 auto;
      text-align: center;
      color: white;
    }

    .footer-links {
      margin-top: 12px;
      display: flex;
      justify-content: center;
      gap: 24px;

      a {
        color: #666;
        text-decoration: none;
        font-size: 14px;

        &:hover {
          color: white;
        }
      }
    }
  `]
})
export class FooterComponent {}
