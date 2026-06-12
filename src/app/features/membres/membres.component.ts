import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Utilisateur } from '../../model/utilisateur.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-membres',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule],
  templateUrl: './membres.component.html'
})
export class MembreComponent implements OnInit {
  membres: Utilisateur[] = [];

  constructor(private utilisateurService: UtilisateurService) {}

  ngOnInit() {
    this.utilisateurService.getAll().subscribe(data => {
      this.membres = data;
    });
  }
}