import jsPDF from 'jspdf';

const generarCertificado = async ({ nombre, nota, fecha }) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4'
  });

  // Cargar imágenes (logos y firma)
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  const logoUDH = await loadImage('/images/LogoUDH.png');
  const logoRSU = await loadImage('/images/logorsu.png');
  const firma = await loadImage('/images/f.png');
// Logos (más arriba)
    doc.addImage(logoUDH, 'PNG', 80, 50, 160, 120);       // antes 70
    doc.addImage(logoRSU, 'PNG', 670, 45, 120, 120);      // antes 65

    // Título principal (más arriba)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(36);
    doc.setTextColor('#000');
    doc.text('CONSTANCIA DE', 420, 90, { align: 'center' });      // antes 110
    doc.text('PARTICIPACIÓN', 420, 125, { align: 'center' });     // antes 145



  // Subtítulo institucional
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
    doc.text(
    'LA OFICINA DE RESPONSABILIDAD SOCIAL UNIVERSITARIA DE LA\nUNIVERSIDAD DE HUÁNUCO RECONOCE A:',
    420,
    180, // de 200 a 180
    { align: 'center' }
    );


  // Nombre del estudiante
  doc.setFont('times', 'bold');
  doc.setFontSize(26); // Aumentado
  doc.setTextColor('#000');
  doc.text(nombre.toUpperCase(), 420, 270, { align: 'center' });

  // Línea horizontal debajo del nombre
  doc.setDrawColor('#000');
  doc.setLineWidth(1);
  doc.line(220, 280, 620, 280); // ajustado ligeramente para alinearse con el nuevo texto

  // Texto de participación
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor('#000');
    doc.text(
    'Por su contribución y compromiso en las actividades realizadas en el marco del plan de\nResponsabilidad Social Universitaria.',
    420,
    310, // reducido de 330 a 310
    { align: 'center' }
    );




  // Firma y cargo
  doc.addImage(firma, 'PNG', 330, 400, 150, 50);

  doc.setDrawColor('#000');
  doc.setLineWidth(1);
  doc.line(300, 460, 540, 460); // línea más corta, más estética

  doc.setFontSize(12);
  doc.setTextColor('#000');
  doc.text('MG. NELSON VALDIVIESO ECHEVARRIA', 420, 480, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor('#444');
  doc.text('Jefe de la oficina de Responsabilidad Social Universitaria', 420, 500, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor('#777');
  doc.text(`Fecha de emisión: ${fecha}`, 420, 530, { align: 'center' });

  return doc.output('blob');
};

export default generarCertificado;
