import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Utilisateur } from '../../model/utilisateur.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';


@Component({
  selector: 'app-membres',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, InputNumberModule, CardModule, FloatLabel, PasswordModule],
  templateUrl: './membres.component.html'
})
export class MembreComponent implements OnInit {
  membres: Utilisateur[] = [];
  showForm = false;
  
  nouveauMembre: Utilisateur = {
    nom: '',
    prenom: '',
    courriel: '',
    nomUtilisateur: '',
    motDePasse: '',
    niveauExpertise: 1
  };

  constructor(private utilisateurService: UtilisateurService) {}

  ngOnInit() {
    this.chargerMembres();
  }

  chargerMembres() {
    this.utilisateurService.getAll().subscribe(data => {
      this.membres = data;
    });
  }

  inscrire() {
    this.utilisateurService.inscrire(this.nouveauMembre).subscribe(() => {
      this.chargerMembres();
      this.nouveauMembre = {
        nom: '',
        prenom: '',
        courriel: '',
        nomUtilisateur: '',
        motDePasse: '',
        niveauExpertise: 1
      };
    });
  }
}