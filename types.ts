export enum ViewMode {
  INDEX = 'index',
  CATALOG = 'catalog',
  GLOSSARY = 'glossary',
  LATEST = 'latest',
}

export enum System {
  CARDIOVASCULAR = '🫀 Cardiovascular',
  RESPIRATORIO = '🫁 Respiratorio',
  DIGESTIVO = '🍎 Digestivo',
  NEUROLOGIA_SENTIDOS = '🧠 Neurología / Sentidos',
  ENDOCRINO_METABOLICO = '💉 Endocrino–Metabólico',
  HEMATOLOGIA = '🩸 Hematología',
  DERMATOLOGIA = '🧴 Dermatología',
  ONCOLOGICAS = '🧬 Oncológicas',
  NEFROLOGIA_UROLOGIA = '💧 Nefrología / Urología',
  MUSCULOESQUELETICO = '💪 Musculoesquelético',
  GINECOLOGIA_OBSTETRICIA = '🤰 Ginecología y Obstetricia',
  PSIQUIATRIA_SALUD_MENTAL = '🧘‍♀️ Psiquiatría / Salud Mental',
  VARIOS = '💊 Infecciosas / Urgencias / Tóxicos',
}


export interface Pathology {
  id: string;
  name: string;
  sistema: System;
  etimologia: string;
  definicionClinica: string;
  sintomatologia: string[];
  diagnosticoNANDA: string;
  intervencionesNIC: string[];
  resultadosNOC: string[];
  planDeCuidados: string;
  farmacosPrincipales: string[];
  clavesResumen: string;
}
