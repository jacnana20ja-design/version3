import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { mockInterns, mockProjects, mockTasks, progressData, departmentData } from '../data/mockData';

interface ReportData {
  totalInterns: number;
  activeInterns: number;
  totalProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  bugTasks: number;
}

const createChartCanvas = async (data: any[], type: 'line' | 'bar' | 'pie', title: string, width: number, height: number): Promise<string> => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 16px Arial';
  ctx.fillText(title, 20, 30);

  if (type === 'bar') {
    const barWidth = (width - 80) / data.length;
    const maxValue = Math.max(...data.map(d => d.value || d.reports || d.progress || 0));

    data.forEach((item, index) => {
      const value = item.value || item.reports || item.progress || 0;
      const barHeight = ((value / maxValue) * (height - 100));
      const x = 40 + (index * barWidth);
      const y = height - 40 - barHeight;

      const gradient = ctx.createLinearGradient(0, y, 0, height - 40);
      gradient.addColorStop(0, '#f97316');
      gradient.addColorStop(1, '#fb923c');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth - 10, barHeight);

      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.fillText(item.name || item.month || item.label, x, height - 20);
      ctx.fillText(value.toString(), x, y - 5);
    });
  } else if (type === 'line') {
    const pointSpacing = (width - 80) / (data.length - 1);
    const maxValue = Math.max(...data.map(d => d.value || d.progress || 0));

    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((item, index) => {
      const value = item.value || item.progress || 0;
      const x = 40 + (index * pointSpacing);
      const y = height - 40 - ((value / maxValue) * (height - 100));

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.fillText(item.name || item.month || item.label, x - 10, height - 20);
    });

    ctx.stroke();
  } else if (type === 'pie') {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

    const colors = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];
    let currentAngle = -Math.PI / 2;

    data.forEach((item, index) => {
      const value = item.value || 0;
      const sliceAngle = (value / total) * Math.PI * 2;

      ctx.fillStyle = colors[index % colors.length];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(Math.round((value / total) * 100) + '%', labelX, labelY);

      currentAngle += sliceAngle;
    });

    let legendY = height - 80;
    data.forEach((item, index) => {
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(20, legendY, 15, 15);
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(item.name || item.label, 40, legendY + 12);
      legendY += 20;
    });
  }

  return canvas.toDataURL('image/png');
};

export const generatePDFReport = async (): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  const addNewPageIfNeeded = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
  };

  pdf.setFontSize(24);
  pdf.setTextColor(249, 115, 22);
  pdf.text('RAPPORT GLOBAL DES STAGIAIRES', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 10;
  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128);
  pdf.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 15;

  const totalInterns = mockInterns.length;
  const activeInterns = mockInterns.filter(i => i.status === 'active').length;
  const totalProjects = mockProjects.length;
  const completedProjects = mockProjects.filter(p => p.status === 'done').length;
  const totalTasks = mockTasks.length;
  const completedTasks = mockTasks.filter(t => t.status === 'done').length;
  const pendingTasks = mockTasks.filter(t => t.status === 'todo').length;
  const inProgressTasks = mockTasks.filter(t => t.status === 'in-progress').length;
  const bugTasks = mockTasks.filter(t => t.status === 'bug').length;

  pdf.setFillColor(249, 115, 22);
  pdf.rect(15, yPosition, pageWidth - 30, 8, 'F');
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  pdf.text('RÉSUMÉ GLOBAL', 20, yPosition + 5.5);

  yPosition += 15;

  pdf.setFontSize(11);
  pdf.setTextColor(31, 41, 55);

  const summaryData = [
    { label: 'STAGIAIRES', items: [
      `Total: ${totalInterns}`,
      `Actifs: ${activeInterns}`,
      `Inactifs: ${totalInterns - activeInterns}`
    ]},
    { label: 'PROJETS', items: [
      `Total: ${totalProjects}`,
      `Terminés: ${completedProjects}`,
      `En cours: ${totalProjects - completedProjects}`,
      `Taux de complétion: ${Math.round((completedProjects / totalProjects) * 100)}%`
    ]},
    { label: 'TÂCHES', items: [
      `Total: ${totalTasks}`,
      `Terminées: ${completedTasks}`,
      `En cours: ${inProgressTasks}`,
      `En attente: ${pendingTasks}`,
      `Bugs: ${bugTasks}`,
      `Taux de complétion: ${Math.round((completedTasks / totalTasks) * 100)}%`
    ]}
  ];

  summaryData.forEach(section => {
    addNewPageIfNeeded(25);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(section.label, 20, yPosition);
    yPosition += 6;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    section.items.forEach(item => {
      pdf.text(`  • ${item}`, 20, yPosition);
      yPosition += 5;
    });
    yPosition += 3;
  });

  addNewPageIfNeeded(80);
  pdf.setFillColor(249, 115, 22);
  pdf.rect(15, yPosition, pageWidth - 30, 8, 'F');
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  pdf.text('GRAPHIQUES DE PERFORMANCE', 20, yPosition + 5.5);
  yPosition += 15;

  const progressChartData = progressData.map(item => ({
    month: item.month,
    progress: item.progress
  }));
  const progressChart = await createChartCanvas(progressChartData, 'line', 'Évolution de la progression', 800, 400);
  if (progressChart) {
    addNewPageIfNeeded(70);
    pdf.addImage(progressChart, 'PNG', 15, yPosition, pageWidth - 30, 60);
    yPosition += 70;
  }

  const departmentChartData = departmentData.map(dept => ({
    name: dept.name,
    value: dept.value
  }));
  const departmentChart = await createChartCanvas(departmentChartData, 'pie', 'Répartition par département', 800, 400);
  if (departmentChart) {
    addNewPageIfNeeded(70);
    pdf.addImage(departmentChart, 'PNG', 15, yPosition, pageWidth - 30, 60);
    yPosition += 70;
  }

  const monthlyStats = [
    { month: 'Jan', reports: 12 },
    { month: 'Fév', reports: 18 },
    { month: 'Mar', reports: 15 },
    { month: 'Avr', reports: 22 },
    { month: 'Mai', reports: 19 },
    { month: 'Jun', reports: 25 }
  ];
  const monthlyChart = await createChartCanvas(monthlyStats, 'bar', 'Rapports mensuels', 800, 400);
  if (monthlyChart) {
    addNewPageIfNeeded(70);
    pdf.addImage(monthlyChart, 'PNG', 15, yPosition, pageWidth - 30, 60);
    yPosition += 70;
  }

  pdf.addPage();
  yPosition = 20;

  pdf.setFillColor(249, 115, 22);
  pdf.rect(15, yPosition, pageWidth - 30, 8, 'F');
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  pdf.text('DÉTAILS PAR STAGIAIRE', 20, yPosition + 5.5);
  yPosition += 15;

  mockInterns.forEach((intern, index) => {
    const internTasks = mockTasks.filter(t => t.assignedTo === intern.id);
    const completedInternTasks = internTasks.filter(t => t.status === 'done').length;
    const internProjects = mockProjects.filter(p => p.assignedInterns.includes(intern.id));

    addNewPageIfNeeded(35);

    pdf.setFillColor(249, 250, 251);
    pdf.rect(15, yPosition, pageWidth - 30, 28, 'F');

    pdf.setFontSize(11);
    pdf.setTextColor(31, 41, 55);
    pdf.setFont('helvetica', 'bold');
    pdf.text(intern.name, 20, yPosition + 6);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Email: ${intern.email}`, 20, yPosition + 11);
    pdf.text(`Département: ${intern.department}`, 20, yPosition + 16);
    pdf.text(`Statut: ${intern.status === 'active' ? 'Actif' : 'Inactif'}`, 20, yPosition + 21);
    pdf.text(`Progression: ${intern.progress}%`, pageWidth - 60, yPosition + 6);
    pdf.text(`Tâches: ${completedInternTasks}/${internTasks.length}`, pageWidth - 60, yPosition + 11);
    pdf.text(`Projets: ${internProjects.length}`, pageWidth - 60, yPosition + 16);

    yPosition += 33;
  });

  pdf.addPage();
  yPosition = 20;

  pdf.setFillColor(249, 115, 22);
  pdf.rect(15, yPosition, pageWidth - 30, 8, 'F');
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  pdf.text('CONCLUSION', 20, yPosition + 5.5);
  yPosition += 15;

  pdf.setFontSize(11);
  pdf.setTextColor(31, 41, 55);
  const conclusions = [
    `Taux de réussite global: ${Math.round((completedTasks / totalTasks) * 100)}%`,
    `Performance des stagiaires: ${activeInterns / totalInterns > 0.8 ? 'Excellente' : 'Bonne'}`,
    `Recommandations: ${completedProjects / totalProjects > 0.7 ? 'Maintenir le rythme actuel' : 'Améliorer le suivi des projets'}`,
    '',
    'Ce rapport démontre une progression positive dans la gestion des stagiaires.',
    'Continuer le suivi régulier des tâches et projets pour maintenir la qualité.'
  ];

  conclusions.forEach(line => {
    pdf.text(line, 20, yPosition);
    yPosition += 7;
  });

  pdf.save(`Rapport_Global_${new Date().toISOString().split('T')[0]}.pdf`);
};
