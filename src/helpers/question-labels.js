export function getQuestionType(type) {
  switch (type) {
    case 'photo':
      return 'Foto klausimas';
    case 'input':
      return 'Atviras klausimas';
    case 'qr':
      return 'QR kodas';
  }
}

export function getSubmissionStatus(status) {
  return status ? 'Atsakytas' : 'Nepateiktas';
}
